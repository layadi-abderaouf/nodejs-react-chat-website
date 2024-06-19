const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const asuncHendler = require('express-async-handler')


const protect = asuncHendler(async (req,res,next)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(" ")[1]
            //decoded token id
            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password')
            next();
        } catch (error) {
            res.status(401)
            throw new Error('not authorized , token failed')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('not authorized , no token')
    }
})

module.exports = {protect}