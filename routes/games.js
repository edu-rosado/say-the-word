const router = require("express").Router()
const Game = require("../models/Game")
const {verifyToken, handleValidationErrors} = require("../common")
const {preValidateGame,validateGame, validateParticipantList} = require("../validation")
const bcrypt = require("bcryptjs")
const User = require("../models/User")

const {words} = require("../words/allWords_spanish.json")
const NUM_OF_WORDS = words.length

// Create game
router.post("/", verifyToken, async (req,res)=>{
    const  {title, hasPassword, participants, maxParticipants} = req.body
    let password = req.body.password
    // TODO: check if the author is among the participants

    // Check if the participants are valid users
    const participantsAreValid = await validateParticipantList(participants)
    if (!participantsAreValid){
        return res.status(400).json({
            errorMessage: "One of the participant usernames is not valid"
            // This cannot happen by chance, it was a hacking attempt
        })
    }

    // Prevalidate some data because I am going to use it before the real validation
    let errorResponse = handleValidationErrors(res, preValidateGame({hasPassword, participants}))
    if (errorResponse) {return errorResponse}

     // Check if password is correct a slong as it is required
     if (hasPassword == false){
        password = "no_password"
    }

    // push creator into participants
    participants.push(req.user.username)

    // Set min number of participants to the max of (2 and the number of current participants)
    const minParticipants = Math.max(2, req.body.participants.length)

     // validate fields
     errorResponse = handleValidationErrors(res, validateGame(
        {title, password, maxParticipants},
        minParticipants
     ))
     if (errorResponse) {return errorResponse}

     password = await bcrypt.hash(password, await bcrypt.genSalt(5))
    const game = new Game({
        ...req.body,
        password,
        messages: [],
        points: {},
        targetWords: {}
    })
    game.points[req.user.username] = 0
    game.targetWords[req.user.username] = null
    game.markModified("targetWords")
    game.markModified("points")
    await game.save()
    const user = await User.findOne({username: req.user.username})
    user.games.push(game._id)
    await user.save()
    return res.status(200).json({
        _id: game._id,
        title: game.title, 
        hasPassword: game.hasPassword, 
        maxParticipants: game.maxParticipants,
        participants: game.participants,
        messages: game.messages,        
        points: game.points,  
    })  
})

// Get all games
router.get("/", verifyToken, async (req,res)=>{
    const games = await Game.find({})
    // For games in which the user is a participant, send the messages, don't do it on the rest!
    // TODO: implement a cache for this
    const gamesToReturn = games.map(game => {
        if (game.participants.includes(req.user.username)){
            return {
                _id: game._id,
                title: game.title, 
                hasPassword: game.hasPassword, 
                maxParticipants: game.maxParticipants,
                participants: game.participants,
                messages: game.messages,
                points: game.points,
            }
        } else{
            return {
                _id: game._id,
                title: game.title, 
                hasPassword: game.hasPassword, 
                maxParticipants: game.maxParticipants,
                participants: game.participants,
                messages: [],
                points: {},
            }
        }
    })
    return res.json(gamesToReturn)
})

// Join or leave a game
router.put("/:gameId", verifyToken, async (req,res)=>{
    let game = null
    try{
        game = await Game.findOne({_id: req.params.gameId})
    }catch{
        return res.status(400).json({
            errorMessage: "The game does not exist"
        })
    }
    const user = await User.findOne({username: req.user.username})
    if (user.games.includes(req.params.gameId)){
        if (req.query.action === "join"){
            return res.status(400).json({
                errorMessage: "You already are a participant in the requested game"
            })
        } else{
            user.games.pop(req.params.gameId)
            await user.save()
            game.participants.pop(user.username)
            delete game.targetWords[user.username]
            delete game.points[user.username]
            game.markModified("targetWords")
            game.markModified("points")
            await game.save()
            return res.json({_id: game._id})
        }
    } else{
        if (req.query.action === "join"){
            if (game.participants.length < game.maxParticipants){
                user.games.push(req.params.gameId)
                await user.save()
                game.participants.push(user.username)
                game.targetWords[user.username] = null
                game.points[user.username] = 0
                game.markModified("targetWords")
                game.markModified("points")
                await game.save()            
                return res.json({
                    _id: game._id,
                    title: game.title, 
                    hasPassword: game.hasPassword, 
                    maxParticipants: game.maxParticipants,
                    participants: game.participants,
                    messages: [],
                    points: game.points,
                })
            } else{
                return res.status(400).json({
                    errorMessage: "The game is full, there are no seats available"
                })
            }
        } else{
            return res.status(400).json({
                errorMessage: "You cannot leave a game if you have not joined before"
            })
        }
    }
    
})

router.post("/:gameId/messages", verifyToken, async (req,res)=>{
    let game = null
    try{
        game = await Game.findOne({_id: req.params.gameId})
    }catch{
        return res.status(400).json({
            errorMessage: "The game does not exist"
        })
    }
    const user = await User.findOne({username: req.user.username})
    if (user.games.includes(req.params.gameId)){
        const msg = {
            author: user.username,
            text: req.body.text,
            date: new Date(),
        }
        game.messages.push(msg)
        await game.save()
        let gotPoint = false
        let winnerName = null
        let loserName = null
        let word = null
        Object.entries(game.targetWords).forEach(
            ([username, targetWord]) =>{
                if (req.body.text.indexOf(targetWord) > -1){
                    if (username === req.user.username){
                        console.log("trampa!")
                    } else{
                        gotPoint = true
                        winnerName = username
                        loserName = user.username,
                        word = targetWord
                    }
                }
        })

        return res.status(200).json({
            msg, gotPoint, winnerName, loserName, word
        })
    } else{
            return res.status(400).json({
                errorMessage: "You are not a participant of the requested game"
            })
    }
})

router.get("/:gameId/new-word", verifyToken, async (req,res)=>{
    let game = null
    try{
        game = await Game.findOne({_id: req.params.gameId})
    }catch{
        return res.status(400).json({
            errorMessage: "The game does not exist"
        })
    }
    const user = await User.findOne({username: req.user.username})
    
    if (user.games.includes(req.params.gameId)){
        const newWord = words[Math.floor(Math.random() * NUM_OF_WORDS)]
        game.targetWords[user.username] = newWord
        game.markModified(`targetWords`)
        await game.save()
        res.json({
            word: newWord
        })        
    } else{
            return res.status(400).json({
                errorMessage: "You are not a participant of the requested game"
            })
    }
})

module.exports = router