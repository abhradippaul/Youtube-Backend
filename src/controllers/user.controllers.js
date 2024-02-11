const User = require("../models/user.models")
const { passwordEncryption, checkPassword } = require("../utils/bcryptSecurity")
const uploadCloudinary = require("../utils/cloudinary")
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken")

const registerUser = async (req, res) => {
    try {
        let { username, password, email, fullname, gender } = req.body
        if (!username || !password || !email || !fullname || !gender) {
            return res.status(401).json({
                message: "Fields cannot be empty"
            })
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })
        if (existedUser) {
            return res.status(401).json({
                message: "User is already taken"
            })
        }

        const avatarLocalPath = req.files.avatar ? req.files.avatar[0].path : null

        const coverImageLocalPath = req.files.coverimage ? req.files.coverimage[0].path : null

        if (!avatarLocalPath) {
            return res.status(401).json({
                message: "Avatar is required"
            })
        }
        const avatarUrl = await uploadCloudinary(avatarLocalPath)
        let coverImageUrl = ""
        if (coverImageLocalPath) {
            coverImageUrl = await uploadCloudinary(coverImageLocalPath)
        }
        if (!avatarUrl) {
            return res.status(501).json({
                message: "Something went wrong in uploading image to the server"
            })
        }

        const encryptedPassword = await passwordEncryption(password)
        const createdUser = await User.create({
            username: username,
            gender: gender,
            fullname: fullname,
            email: email,
            password: encryptedPassword,
            avatar: avatarUrl,
            coverimage: coverImageUrl
        })
        return res.status(201).json({
            ...createdUser,
            message: "success"
        })
    } catch (err) {
        return res.status(401).json({
            ERROR: err.message,
            message: "Database is giving error"
        })
    }

}

const loginUser = async (req, res) => {
    
}


module.exports = {
    registerUser,
    loginUser
}