import express from 'express'
import dotenv from 'dotenv'
import connectDB from './configs/Db.js'
import authRoute from './routes/authRoutes.js'
import { notFound } from './middlewares/errorMiddlewares.js'
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

app.use(notFound)
app.listen(port, () => {
    console.log(`Server running in ${port}`)
})


