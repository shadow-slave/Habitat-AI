import mongoose from "mongoose";



const MSRIT_LAT = 13.0306;
const MSRIT_LNG = 77.5649;

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
        street: { type: String, required: true },
        pincode: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    distanceFromMSRIT: {
        type: Number,

    },

    images: [{
        type: String
    }],

    cost: {
        min: { type: Number, required: true },
        max: { type: Number },
        per: { type: String, default: "Month" }
    },

    // --- Specific Details (Arrays for Filtering) ---
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
    }]

}, { timestamps: true });

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

venueSchema.pre("save", function (next) {
    if (this.address.latitude && this.address.longitude) {
        const R = 6371;
        const dLat = deg2rad(this.address.latitude - MSRIT_LAT);
        const dLon = deg2rad(this.address.longitude - MSRIT_LNG);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(MSRIT_LAT)) * Math.cos(deg2rad(this.address.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        this.distanceFromMSRIT = parseFloat(distance.toFixed(1));
    }

    next();
});
const Venue = mongoose.model("Venue", venueSchema);
export default Venue;