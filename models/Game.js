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
    roles: mongoose.Schema.Types.Mixed,
    votes: mongoose.Schema.Types.Mixed,
    points: mongoose.Schema.Types.Mixed,
    host: String,
    status: String,
})

module.exports = mongoose.model("Game", gameSchema)
