import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sentiment: {
        type: String
    },
    rating: {
        type: Number,
        required: true
    }

})

const Review = mongoose.model("Review", reviewSchema)

export default Review