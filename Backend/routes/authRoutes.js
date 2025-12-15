import express from 'express'

const router = express.Router()


router.post("/", async (req, res) => {
    const { name, email, password, institution, occupation } = req.body

})


export default router