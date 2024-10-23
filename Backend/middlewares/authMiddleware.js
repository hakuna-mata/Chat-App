const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")

const protect = asyncHandler(async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            // console.log(req.headers.authorization);
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            // console.log(`Decoded ${decoded}`);
            // console.log(decoded.id);
            
            req.user = await User.findById(decoded.id).select("-password");
            next()
        } catch (error) {
            console.log(error);
            
            res.status(401)
            throw new Error("Not authorized.Token failed")
        }
    }
    if(!token){
        res.status(401)
        throw new Error("Not authorized,no token")
    }
})

module.exports={protect}