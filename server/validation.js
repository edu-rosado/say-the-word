const Joi = require("joi")


const userRegisterSchema = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1023).required(),
})
const validateRegister = data =>{
    return userRegisterSchema.validate(data)
}

const userLoginSchema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1023).required(),
})
const validateLogin = data =>{
    return userLoginSchema.validate(data)
}

const guestUserLoginSchema = Joi.object({
    username: Joi.string().min(6).max(255).required(),
})
const validateLoginGuest = data =>{
    return guestUserLoginSchema.validate(data)
}

module.exports = {
    validateRegister,
    validateLogin,
    validateLoginGuest,
}
