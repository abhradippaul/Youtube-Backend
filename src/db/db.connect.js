const mongoose = require("mongoose")
const { DB_NAME } = require("../constants")

const dbConnect = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URL}`)
    } catch (err) {
        console.log("Database connection error ", err)
    }
}
module.exports = { dbConnect }
