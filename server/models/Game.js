const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true,
        min:1,
        max:63
    },
    participants: {
        type: String,
        required:true,
    },
    hasPassword: {
        type: Boolean,
        required:true,
        default:false,
    },
    password: {
        type: String,
        required:false,
        min:1,
        max: 63
    },
})

module.exports = mongoose.model("Game", userSchema)