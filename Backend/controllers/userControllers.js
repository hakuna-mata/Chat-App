const asyncHandler = require("express-async-handler");
const  User  = require("../models/userModel");
const {genToken} = require("../config/generateToken")

module.exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please enter all fields")
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    })

    if (user) {
        res.status(201).json({
            name:user.name,
            _id: user._id,
            email: user.email,
            password: user.password,
            pic: user.pic,
            token:genToken(user._id)
        })
    } else {
        res.status(401).json("Failed to create the user")
    }
})

module.exports.authUser = asyncHandler(async(req,res)=>{
    let{email,password}=req.body;
    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic: user.pic,
            token: genToken(user._id)
        })
    }else{
        res.status(400).json("Invalid email or password")
    }
})

module.exports.allUsers = asyncHandler(async(req,res)=>{
    // let keyword = req.query.search ? {$or:[{name:{$regex:req.query.search,$options:"i"}},{email:{$regex:req.query.search,$options:"i"}}]}:{}
                  
    const users = req.query.search ? await User.find({$or:[{name:{$regex:req.query.search,$options:"i"}},{email:{$regex:req.query.search,$options:"i"}}]}).find({_id:{$ne:req.user._id}}):{}
    res.send(users)
})