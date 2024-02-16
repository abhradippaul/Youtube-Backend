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
        url :{
            type: String,
            required: true
        },
        public_id :{
            type: String,
            required: true
        }
    },
    coverimage: {
        url :{
            type: String
        },
        public_id : {
            type: String
        }
    },
    refreshtoken: {
        type: String,
    }
}, { timestamps: true })
const User = mongoose.model("User", userSchema)
module.exports = User