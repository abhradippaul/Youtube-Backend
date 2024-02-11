const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    gender : {
        type: String,
        enum : ["male","female","others"],
        required : true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    watchhistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    publishvideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    fullname: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    coverimage: {
        type: String,
    },
    refreshtoken: {
        type: String,
    }
}, { timestamps: true })
const User = mongoose.model("User", userSchema)
module.exports = User