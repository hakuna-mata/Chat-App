const jwt = require("jsonwebtoken")

module.exports.genToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"30d"
    })
}

module.exports.validate = (email)=>{
    let emailRegex = /[A-Za-z0-9]+@[a-z]+\.[a-z]{2}$/g
    return emailRegex.test(email)
}

module.exports.validatePass = (password)=>{
    let passRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/
    return passRegex(password)
}