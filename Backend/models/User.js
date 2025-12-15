import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Add a name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    institution: {
        type: String,
    },
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    },
    occupation: {
        type: String,
    }
}, { timestamps: true })


const User = mongoose.model("User", userSchema)
export default User