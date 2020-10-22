const { array } = require("joi")
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isGuest: Boolean,
    isOnline: Boolean,
    date: {
        type: Date,
        default: Date.now,
    },
    friends: [{ type: String}], // the username
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game"
    }],
})

module.exports = mongoose.model("User", userSchema)