const { v2: cloudinary } = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});
const uploadCloudinary = async (localPath) => {
    try {
        if (!localPath) {
            return null
        }
        const data = await cloudinary.uploader.upload(localPath,
            { resource_type: "auto" })
        return data.url
    } catch (err) {
        return null
    }
}

module.exports = uploadCloudinary