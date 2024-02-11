const jwt = require("jsonwebtoken")

const generateAccessToken = async(payload) => {
    return await jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn : "1d"})
}

const generateRefreshToken = async(payload) => {
    return await jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_KEY,{expiresIn : "10d"})
}

const tokenToData = async(token,key) => {
    return await jwt.verify(token, key) 
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    tokenToData
}