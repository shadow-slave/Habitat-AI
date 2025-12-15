import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true },
    type: { type: String, enum: ["PG", "Mess"], required: true },
    contactNo: { type: String, required: true },

    rating: { type: Number, default: 0, min: 0, max: 5 },

    address: {
        street: String,
        pincode: String,
        latitude: Number,
        longitude: Number,
    },

    distanceFromMSRIT: { type: Number, default: 0 },

    images: [String],

    cost: {
        min: { type: Number, required: true },
        max: Number,
        per: { type: String, default: "Month" },
    },

    // -------- PG ONLY --------
    availableRoomTypes: {
        type: [String],
        enum: ["Single Room", "1BHK", "2BHK", "3BHK"],
        default: undefined,
    },

    sharingTypes: {
        type: [String],
        enum: ["Single", "Double", "Triple", "Quadruple"],
        default: undefined,
    },

    // -------- MESS ONLY --------
    foodType: {
        type: String,
        enum: ["Veg", "Non-Veg", "Both"],
    },

    mealsProvided: {
        breakfast: { type: Boolean, default: false },
        lunch: { type: Boolean, default: false },
        dinner: { type: Boolean, default: false },
    },

    weeklyMenu: [
        {
            day: String,
            breakfast: String,
            lunch: String,
            dinner: String,
        },
    ],

    aiSummary: {
        type: String,
        default: "Not enough reviews yet to generate a summary.",
    },
}, { timestamps: true });

export default mongoose.model("Venue", venueSchema);
