import express from 'express'
import dotenv from 'dotenv'
import connectDB from './configs/Db.js'
import authRoute from './routes/authRoutes.js'
import venueRoute from './routes/venueRoutes.js'
import { errorHandler, notFound } from './middlewares/errorMiddlewares.js'
dotenv.config()


const app = express()
const port = process.env.PORT || 5500

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => {
    res.json({ message: "Welcome to Habitat" })
})

// Auth Routes

app.use("/api/auth", authRoute)
app.use("/api/admin", venueRoute)

app.use(notFound)
app.use(errorHandler)
app.listen(port, () => {
    console.log(`Server running in ${port}`)
})


