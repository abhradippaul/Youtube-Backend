const express = require("express")
const cors = require("cors")
const userRouter = require("./routes/user.routes.js")
const cookieParser = require("cookie-parser")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use(cookieParser())
app.use(express.static("public"))
app.use("/api/v1/users",userRouter)

module.exports = app
