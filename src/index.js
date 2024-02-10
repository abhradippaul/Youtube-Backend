require("dotenv").config()
const app = require("./app.js")
const {dbConnect} = require("./db/db.connect.js")


dbConnect().then(() => {
    app.listen(process.env.PORT || 80,()=>{
        console.log("Server connected")
    })
}).catch((err) => {
    console.log("Express connection error ",err)
})