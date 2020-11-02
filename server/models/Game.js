const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema({
    title: String,
    participants: Array,
    hasPassword: Boolean,
    password: String,
    maxParticipants: Number,
    messages: [{
        author: String, // the username
        text: String,
        date: Date,
    }],
    targetWords: mongoose.Schema.Types.Mixed,
    points: mongoose.Schema.Types.Mixed,
})

module.exports = mongoose.model("Game", gameSchema)
