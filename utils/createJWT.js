const jwt = require('jsonwebtoken');
require('dotenv').config()
const createToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.SECRET, {
      expiresIn: "30d",
    });
    return token
}

module.exports = createToken