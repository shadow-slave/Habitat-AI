import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

const router = express.Router()


router.post("/", async (req, res, next) => {
    const { name, email, password, institution, occupation } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return next(new Error("User Already Exists"))
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = new User({
        name, email, password: hashedPassword, institution, occupation
    })

    const savedUser = await user.save()
    const response = savedUser.toObject()
    delete response.password
    res.status(201).json({ message: "User Saved Successfully", isSuccess: true, response })

})

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(404).json({ message: "Invalid email or password", isSuccess: false })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password", isSuccess: false })
        }

        // Clean up user object for response
        const userResponse = user.toObject()
        delete userResponse.password
        delete userResponse.__v

        req.user = user

        res.status(200).json({
            message: "Login Successful",
            isSuccess: true,
            user: userResponse,
            role: user.role
        })

    } catch (error) {
        next(error)
    }
})

router.post("/logout", (req, res, next) => {
    res.status(200).json({ message: "Logout Success", isSuccess: true })
    req.user = null
})



export default router