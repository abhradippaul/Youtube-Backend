const express = require("express")
const router = express.Router()
const { registerUser, loginUser, logoutUser, updateUser, updateAvatar, updateCoverImage } = require("../controllers/user.controllers.js")
const upload = require("../middlewares/multer.middlewares.js")
const { userMiddleware } = require("../middlewares/auth.middlewares.js")

router.route("/register").post(upload.fields([{
    name: "avatar",
    maxCount: 1
},
{
    name: "coverimage",
    maxCount: 1
}]), registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(userMiddleware,logoutUser)
router.route("/updateuser").post(userMiddleware,updateUser)
router.route("/updateavatar").post(upload.single("avatar"),userMiddleware,updateAvatar)
router.route("/updatecoverimage").post(upload.single("coverimage"),userMiddleware,updateCoverImage)

module.exports = router