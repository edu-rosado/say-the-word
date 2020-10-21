const { number } = require("joi")
const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true,
        min:1,
        max:63
    },
    participants: {
        type: Array,
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
    maxParticipants: {
        type: Number,
        required:true,
    },
})

module.exports = mongoose.model("Game", userSchema)