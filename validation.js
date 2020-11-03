const Joi = require("joi")
const User = require("./models/User")

const userRegisterSchema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    email: Joi.string().max(255).required().email(),
    password: Joi.string().min(3).max(1023).required(),
    friends: Joi.array(),
})
const validateRegister = data =>{
    return userRegisterSchema.validate(data)
}

///////////////////////

const userLoginSchema = Joi.object({
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(3).max(1023).required(),
})
const validateLogin = data =>{
    return userLoginSchema.validate(data)
}

///////////////////////

const guestUserLoginSchema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
})
const validateLoginGuest = data =>{
    return guestUserLoginSchema.validate(data)
}

///////////////////////

const gameCreationSchema_pre = Joi.object({
    hasPassword: Joi.boolean().required(),
    participants: Joi.array().required(),
})
const preValidateGame = data =>{
    return gameCreationSchema_pre.validate(data)
}

const createGameValidationSchema = (minParticipants) =>{
    return Joi.object({
        title: Joi.string().min(3).max(40).required(),
        password: Joi.string().min(6).max(40),
        maxParticipants: Joi.number().min(minParticipants).max(10).required(),
    })
}

const validateGame = (data,minParticipants) =>{
    const schema = createGameValidationSchema(minParticipants)
    return schema.validate(data)
}

///////////////////////

const validateParticipantList = async (list)=>{
    const users = await User.find({ username: { $in: list}})
    if (users.length != list.length) {return false}
    return true
}

///////////////////////

module.exports = {
    validateRegister,
    validateLogin,
    validateLoginGuest,
    preValidateGame,
    validateGame,
    validateParticipantList,
}
