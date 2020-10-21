const { array } = require("joi")
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        min:6,
        max:255
    },
    email: {
        type: String,
        required:false,
        min:6,
        max:255
    },
    password: {
        type: String,
        required:false,
        min:6,
        max:1023
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isGuest: {
        type: Boolean,
        required:true,
    },
    isOnline: {
        type: Boolean,
        default: true,
    },
    friends: {
        type: Array,
        default: []
    },
    games: {
        type: Array,
        default: []
    },
})

module.exports = mongoose.model("User", userSchema)