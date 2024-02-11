const express = require("express")
const router = express.Router()
const { registerUser, loginUser } = require("../controllers/user.controllers.js")
const upload = require("../middlewares/multer.middlewares.js")

router.route("/register").post(upload.fields([{
    name: "avatar",
    maxCount: 1
},
{
    name: "coverimage",
    maxCount: 1
}]), registerUser)

router.route("/login").post(loginUser)

module.exports = router