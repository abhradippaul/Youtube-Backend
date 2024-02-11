const { tokenToData } = require("../utils/generateToken")

const userMiddleware = async (req, res, next) => {
    try {
        const cookieValue = req.cookies.accesstoken
        if (!cookieValue) {
            return res.status(404).json({
                message: "User not log in"
            })
        }
        const userData = await tokenToData(cookieValue, process.env.ACCESS_TOKEN_SECRET_KEY)
        if (!userData) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        req.user = userData
        next()
    } catch (err) {
        return res.status(404).json({
            ERROR: err.message,
            message: "User not found"
        })
    }
}
module.exports = {
    userMiddleware
}