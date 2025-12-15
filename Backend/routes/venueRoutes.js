import express from 'express'
import Venue from '../models/Venue.js'
import Sentiment from 'sentiment'
import Review from '../models/Review.js'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { GoogleGenerativeAI } from "@google/generative-ai"; // <--- Import Google AI
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()
const sentiment = new Sentiment()

const MSRIT_LAT = 13.0306;
const MSRIT_LNG = 77.5649;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function calculateDistance(lat, lon) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat - MSRIT_LAT);
    const dLon = deg2rad(lon - MSRIT_LNG);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(MSRIT_LAT)) * Math.cos(deg2rad(lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1)); // Returns distance in km (1 decimal place)
}


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'habitat_venues', // The folder name in your Cloudinary dashboard
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: storage });


async function updateVenueSummary(venueId) {
    try {
        // 1. Fetch all reviews for this venue
        const reviews = await Review.find({ venueId }).select('description rating');

        if (reviews.length === 0) return;

        // 2. Prepare text for AI
        const reviewTexts = reviews.map(r => `- "${r.description}" (${r.rating}/5)`).join("\n");

        const prompt = `
            You are a helpful assistant for students looking for housing. 
            Here are recent reviews for a hostel/mess:
            ${reviewTexts}

            Based on these reviews, write a very short, balanced summary (max 2 sentences).
            Format it like: "Pros: ... Cons: ..."
            Do not include Markdown formatting or bold text.
        `;

        // 3. Call Gemini API
        const result = await model.generateContent(prompt);
        const aiSummary = result.response.text();

        // 4. Update Venue in DB
        await Venue.findByIdAndUpdate(venueId, { aiSummary: aiSummary });
        console.log(`Updated AI Summary for ${venueId}`);

    } catch (error) {
        console.error("AI Summary Generation Failed:", error);
        // Don't crash the server if AI fails, just log it
    }
}

router.post("/", upload.array("images"), async (req, res) => {
    try {
        const imageUrls = req.files?.map(f => f.path) || [];

        const {
            name, type, ownerName, contactNo, description,
            minPrice, maxPrice, street, latitude, longitude,

            // MESS
            foodType,
            mealsProvided,
            weeklyMenu,

            // PG
            availableRoomTypes,
            sharingTypes
        } = req.body;

        let distanceFromMSRIT = 0;
        if (latitude && longitude) {
            distanceFromMSRIT = calculateDistance(Number(latitude), Number(longitude));
        }

        const venueData = {
            name,
            type,
            ownerName,
            contactNo,
            description,
            images: imageUrls,
            distanceFromMSRIT,

            cost: {
                min: Number(minPrice),
                max: Number(maxPrice),
                per: "Month"
            },

            address: {
                street,
                pincode: "560054",
                latitude: Number(latitude),
                longitude: Number(longitude),
            }
        };

        if (type === "PG") {
            venueData.availableRoomTypes = JSON.parse(availableRoomTypes || "[]");
            venueData.sharingTypes = JSON.parse(sharingTypes || "[]");
        }

        if (type === "Mess") {
            venueData.foodType = foodType;
            venueData.mealsProvided = JSON.parse(mealsProvided || "{}");
            venueData.weeklyMenu = JSON.parse(weeklyMenu || "[]");
        }

        const venue = await Venue.create(venueData);

        res.status(201).json({ isSuccess: true, data: venue });
    } catch (err) {
        res.status(400).json({ isSuccess: false, message: err.message });
    }
});


router.get("/", async (req, res, next) => {
    const { distance, rating, price, type } = req.query

    const query = {
        __v: 1
    }
    if (type) query.type = type
    if (distance) query.distanceFromMSRIT = { $lte: Number(distance) }
    if (price) query["cost.min"] = { $lte: Number(price) }
    if (rating) query.rating = { $gte: Number(rating) }

    let venues = await Venue.find(query).sort({ rating: -1 }).lean()

    if (!venues.length) {
        return res.status(200).json({ count: 0, isSuccess: true, data: [] })
    }

    const venueIds = venues.map(v => v._id)
    const reviews = await Review.find({ venueId: { $in: venueIds } }).select('venueId sentiment rating')

    venues = venues.map(venue => {
        const venueReviews = reviews.filter(r => r.venueId.toString() === venue._id.toString())

        if (venueReviews.length === 0) {
            return { ...venue, generalSentiment: "No Reviews", computedRating: 0, totalReviews: 0 }
        }

        const totalRating = venueReviews.reduce((sum, r) => sum + r.rating, 0)
        const avgRating = Number((totalRating / venueReviews.length).toFixed(1))

        let positive = 0
        let negative = 0
        venueReviews.forEach(r => {
            if (r.sentiment === "Positive") positive++
            if (r.sentiment === "Negative") negative++
        })

        let generalSentiment = "Neutral"
        if (positive > negative) generalSentiment = "Positive"
        else if (negative > positive) generalSentiment = "Negative"

        return {
            ...venue,
            computedRating: avgRating,
            generalSentiment,
            totalReviews: venueReviews.length
        }
    })

    res.status(200).json({
        count: venues.length,
        isSuccess: true,
        data: venues
    })
})

router.get("/verify", async (req, res, next) => {
    try {
        const venues = await Venue.find({ __v: 0 }).sort({ createdAt: -1 });
        res.status(200).json({
            isSuccess: true,
            venues,
        });
    } catch (err) {
        next(err);
    }
});

router.post("/verify/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const venue = await Venue.findByIdAndUpdate(
            id,
            { __v: 1 },
            { new: true }
        );

        if (!venue) {
            res.status(404);
            return next(new Error("Venue not found"));
        }

        res.status(200).json({
            isSuccess: true,
            message: "Venue verified and published",
            venue,
        });
    } catch (err) {
        next(err);
    }
});
router.delete("/verify/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const venue = await Venue.findByIdAndUpdate(
            id,
            { __v: 2 },
            { new: true }
        );

        if (!venue) {
            res.status(404);
            return next(new Error("Venue not found"));
        }

        res.status(200).json({
            isSuccess: true,
            message: "Venue rejected",
            venue,
        });
    } catch (err) {
        next(err);
    }
});


router.get("/:id", async (req, res, next) => {
    const { id } = req.params

    const venue = await Venue.findById(id).lean()

    if (!venue) {
        res.status(404)
        return next(new Error("Venue not found"))
    }


    const reviews = await Review.find({ venueId: id })
        .populate("userId", "name")
        .sort({ createdAt: -1 })

    let positive = 0
    let negative = 0
    reviews.forEach(r => {
        if (r.sentiment === "Positive") positive++
        if (r.sentiment === "Negative") negative++
    })

    let generalSentiment = "Neutral"
    if (positive > negative) generalSentiment = "Positive"
    else if (negative > positive) generalSentiment = "Negative"

    res.status(200).json({
        isSuccess: true,
        data: {
            ...venue,
            generalSentiment,
            reviews
        }
    })
})


router.post("/review", async (req, res, next) => {
    const { venueId, description, rating, userId } = req.body

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    // 1. Sentiment Analysis (Local - Fast)
    const result = sentiment.analyze(description)
    let sentimentLabel = "Neutral"
    if (result.score > 0) sentimentLabel = "Positive";
    if (result.score < 0) sentimentLabel = "Negative";

    // Toxic Language Filter
    if (result.score < -3) {
        res.status(400)
        return next(new Error("Review contains toxic language"))
    }

    const venue = await Venue.findById(venueId)
    if (!venue) {
        res.status(404)
        return next(new Error("Invalid venue"))
    }

    // 2. Save Review
    const newReview = new Review({
        venueId,
        description,
        userId: userId,
        rating: Number(rating),
        sentiment: sentimentLabel
    })
    await newReview.save()

    // 3. Update Average Rating
    const reviews = await Review.find({ venueId })
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const newAvgRating = totalRating / reviews.length
    venue.rating = Number(newAvgRating.toFixed(1))
    await venue.save()

    await newReview.populate("userId", "name email");


    updateVenueSummary(venueId);

    res.status(201).json({ message: "Review added", data: newReview });
})








export default router