const mongoose = require("mongoose")
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: true
    },
    isPublished: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })
const Video = mongoose.model("Video", videoSchema)

module.exports = Video