import express from 'express'
import Venue from '../models/Venue.js'
import Sentiment from 'sentiment'
import Review from '../models/Review.js'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { attachUser } from '../middlewares/auth.js'

const router = express.Router()
const sentiment = new Sentiment()

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


router.post("/", upload.array('images'), async (req, res, next) => {

    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const venueData = {
        ...req.body,
        images: imageUrls
    }

    const newVenue = new Venue(venueData)
    const savedVenue = await newVenue.save()

    res.status(200).json({
        message: "Venue created successfully",
        isSuccess: true,
        data: savedVenue
    })

})

router.get("/", async (req, res, next) => {
    const { distance, rating, price, type = "PG" } = req.query

    const query = {}
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
    const { venueId, description, rating } = req.body

    const result = sentiment.analyze(description)
    const userId = req.user

    let sentimentLabel = "Neutral"
    if (result.score > 0) sentimentLabel = "Positive";
    if (result.score < 0) sentimentLabel = "Negative";

    if (result.score < -3) {
        res.status(400)
        return next(new Error("Review contains toxic language"))
    }


    const venue = await Venue.findById(venueId)
    if (!venue) {
        res.status(404)
        return next(new Error("Invalid venue"))
    }



    const newReview = new Review({
        venueId,
        description,
        userId: req.user._id,
        rating: Number(rating),
        sentiment: sentimentLabel
    })

    await newReview.save()

    const reviews = await Review.find({ venueId })
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const newAvgRating = totalRating / reviews.length
    venue.rating = Number(newAvgRating.toFixed(1))
    await venue.save()

    res.status(201).json({ message: "Review added", data: newReview });
})











export default router