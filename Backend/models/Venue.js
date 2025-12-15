import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Venue Name is required"],
        trim: true
    },
    ownerName: {
        type: String,
        required: [true, "Owner Name is required"]
    },
    type: {
        type: String,
        enum: ["PG", "Mess"],
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    address: {
        street: { type: String, },
        pincode: { type: String, },
        latitude: { type: Number, },
        longitude: { type: Number, }
    },
    distanceFromMSRIT: {
        type: Number,
        default: 0 // Default to 0 if calculation fails
    },
    images: [{
        type: String
    }],
    cost: {
        min: { type: Number, required: true },
        max: { type: Number },
        per: { type: String, default: "Month" }
    },
    // --- Specific Details ---
    availableFoods: [{
        type: String,
    }],
    availableRoomTypes: [{
        type: String,
        enum: ["1BHK", "2BHK", "3BHK", "Single Room"]
    }],
    sharingTypes: [{
        type: String,
        enum: ["Single", "Double", "Triple", "Quadruple"]
    }],
    aiSummary: {
        type: String,
        default: "Not enough reviews yet to generate a summary."
    },

}, { timestamps: true });

const Venue = mongoose.model("Venue", venueSchema);
export default Venue;