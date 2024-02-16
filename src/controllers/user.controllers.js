const User = require("../models/user.models")
const { passwordEncryption, checkPassword } = require("../utils/bcryptSecurity")
const { uploadCloudinary, deleteCloudinary } = require("../utils/cloudinary")
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
            // console.log(coverImageLocalPath)
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

        const options = { httpOnly: true, secure: true }
        const isTokenSavedInDB = await User.findByIdAndUpdate({
            _id: userInfo._id
        }, { refreshtoken: refreshToken })
        if (!isTokenSavedInDB) {
            return res.status(501).json({
                message: "Database error"
            })
        }
        return res.status(200)
            .cookie("refreshtoken", refreshToken, options)
            .cookie("accesstoken", accessToken, options)
            .json({
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

const logoutUser = async (req, res) => {
    try {
        const { _id } = req.user
        if (!_id) {
            return res.status(401).json({
                message: "id not found"
            })
        }
        const isUpdated = await User.findByIdAndUpdate(_id, { refreshtoken: "" })
        if (!isUpdated) {
            return res.status(401).json({
                message: "Database problem"
            })
        }
        return res
            .status(201)
            .clearCookie("accesstoken")
            .clearCookie("refreshtoken")
            .json({
                message: "You are logged out"
            })

    } catch (err) {
        return res.status(404).json({
            ERROR: err.message,
            message: "Something went wrong"
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const { fullname, email } = req.body
        const { _id } = req.user
        if (!fullname || !email) {
            return res.status(404).json({
                message: "Update info is required"
            })
        }
        const updatedUser = await User.findByIdAndUpdate(_id, {
            fullname,
            email
        })
        if (!updatedUser) {
            return res.status(404).json({
                message: "Problem in user update"
            })
        }
        return res.status(200).json({
            message: "User update successful"
        })

    } catch (err) {
        return res.status(404).json({
            ERROR: err.message,
            message: "Something went wrong"
        })
    }
}

const updateAvatar = async (req, res) => {
    try {
        const avatarLocalPath = req.file.path
        const { _id } = req.user
        const { avatar } = await User.findById(_id)
        if (!avatar) {
            return res.status(401).json({
                message: "Avatar not found"
            })
        }
        const isUpdated = await deleteCloudinary(avatar.public_id)
        if (!isUpdated) {
            return res.status(401).json({
                message: "Cloudinary update is failed"
            })
        }

        if (!avatarLocalPath) {
            return res.status(401).json({
                message: "Image is required"
            })
        }
        const cloudinaryUrl = await uploadCloudinary(avatarLocalPath)
        // console.log(cloudinaryUrl)

        const updatedUser = await User.findByIdAndUpdate(_id, {
            avatar: cloudinaryUrl
        })
        if (!updatedUser) {
            return res.status(400).json({
                message: "Avatar update is failed"
            })
        }
        return res.status(200).json({
            message: "Avatar is successfully updated"
        })

    } catch (err) {
        return res.status(404).json({
            ERROR: err.message,
            message: "Something went wrong"
        })
    }
}

const updateCoverImage = async (req, res) => {
    try {
        const coverImageLocalPath = req.file.path
        const { _id } = req.user
        const { coverimage } = await User.findById(_id)
        if (coverimage) {
            const isUpdated = await deleteCloudinary(coverimage.public_id)
            if (!isUpdated) {
                return res.status(401).json({
                    message: "Cloudinary update is failed"
                })
            }
        }
        if (!coverImageLocalPath) {
            return res.status(401).json({
                message: "Image is required"
            })
        }
        const coverImageUrl = await uploadCloudinary(coverImageLocalPath)
        // console.log(cloudinaryUrl)

        const updatedUser = await User.findByIdAndUpdate(_id, {
            coverimage: coverImageUrl
        })
        if (!updatedUser) {
            return res.status(400).json({
                message: "Avatar update is failed"
            })
        }
        return res.status(200).json({
            message: "Avatar is successfully updated"
        })


    } catch (err) {
        return res.status(404).json({
            ERROR: err.message,
            message: "Something went wrong"
        })
    }
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    updateAvatar,
    updateCoverImage
}