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
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).json({
                message: "Email and password is required for user login"
            })
        }
        const userInfo = await User.findOne({ email })
        if (!userInfo) {
            return res.status(402).json({
                message: "User not found"
            })
        }
        const isValidUser = await checkPassword(password, userInfo.password)
        if (!isValidUser) {
            return res.status(402).json({
                message: "Email or password is wrong"
            })
        }
        const accessToken = await generateAccessToken({ _id: userInfo._id })
        const refreshToken = await generateRefreshToken({ _id: userInfo._id })
        if (!accessToken || !refreshToken) {
            return res.status(501).json({
                message: "Something went wrong in server side"
            })
        }

        const isTokenSavedInDB = await User.findByIdAndUpdate({
            _id: userInfo._id
        }, { refreshtoken: refreshToken })
        if (!isTokenSavedInDB) {
            return res.status(501).json({
                message: "Database error"
            })
        }
        return res.status(200).cookie("accesstoken", accessToken, { httpOnly: true, secure : true }).json({
            message: "Successful",
            AccessToken: accessToken,
            RefreshToken: refreshToken
        })
    } catch (err) {
        return res.status(401).json({
            ERROR: err.message,
            message: "Database is giving error"
        })
    }
}


module.exports = {
    registerUser,
    loginUser
}