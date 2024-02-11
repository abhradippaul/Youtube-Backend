const bcrypt = require("bcrypt")
const passwordEncryption = async (password) => {
   return await bcrypt.hash(password, 10)
}

const checkPassword = async (password, encryptPassword) => {
   return await bcrypt.compare(password, encryptPassword)
}

module.exports = {
   passwordEncryption,
   checkPassword
}
