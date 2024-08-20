const jwt = require('jsonwebtoken')
require('dotenv').config()
const asyncHandler = require('../middleware/asyncHandler')
const authenticate = asyncHandler(async(req, res ,next) => {
    try {
        const token = req.headers.authorization;
        if(!token){
            return res.status(400).send("Not authorized")
        }
        const decoded = jwt.verify(token ,process.env.SECRET);
        req.user = decoded
        return next();
    } catch (error) {
        res.status(500)
        throw new Error('Internal server Error')
    }
}) 
module.exports = authenticate