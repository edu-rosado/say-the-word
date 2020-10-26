const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema({
    title: String,
    participants: Array,
    hasPassword: Boolean,
    password: String,
    maxParticipants: Number,
    messages: [{
        author: String, // the username
        body: String,
        // TODO: add date
    }],
})

module.exports = mongoose.model("Game", gameSchema)
