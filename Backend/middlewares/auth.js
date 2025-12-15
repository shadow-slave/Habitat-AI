import User from "../models/User.js";


export const attachUser = async (req, res, next) => {
    const userId = req.headers['x-user-id']

    if (!userId) {
        return res.status(401).json({ message: "You must be logged in" });
    }
    req.user = userId;
    next();
}