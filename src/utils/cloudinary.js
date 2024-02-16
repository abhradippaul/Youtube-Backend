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
            // console.log(data)
        return { url: data.url, public_id: data.public_id }
    } catch (err) {
        // console.log(err)
        return null
    }
}

const deleteCloudinary = async (public_id) => {
    try {
        if (!public_id) {
            return null
        }
        const data = await cloudinary.api.delete_resources([`${public_id}`])
        return data

    } catch (err) {
        return null
    }
}

module.exports = { uploadCloudinary, deleteCloudinary }