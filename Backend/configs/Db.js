import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connection Success: ${conn.connection.host}`)
    } catch (error) {
        console.log("Database Error")
        console.log(error)
    }
}



export default connectDB