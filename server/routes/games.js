const router = require("express").Router()
const Game = require("../models/Game")
const {verifyToken, handleValidationErrors} = require("../common")
const {preValidateGame,validateGame, validateParticipantList} = require("../validation")
const bcrypt = require("bcryptjs")
const User = require("../models/User")

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
    })
    await game.save()
    const user = await User.findOne({username: req.user.username})
    user.games.push(game._id)
    await user.save()
    return res.status(200).json({id: game._id})  
})

// Get all games
router.get("/", verifyToken, async (req,res)=>{
    const games = await Game.find({})
    return res.json(games.map(game => (
        {
            id: game._id,
            title: game.title, 
            hasPassword: game.hasPassword, 
            maxParticipants: game.maxParticipants,
            currentParticipants: game.participants.length,
        }
    )))
})

// Join or leave a game
router.put("/:gameId", verifyToken, async (req,res)=>{
    try{
        const game = await Game.find({_id: req.params.gameId})
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
            user.games.pop(req.param.gameId)
            await user.save()
            game.participants.pop(user.username)
            await game.save()
            return res.send()
        }
    } else{
        if (req.query.action === "join"){
            if (game.participants.length < game.maxParticipants){
                user.games.push(req.param.gameId)
                await user.save()
                game.participants.pop(user.username)
                await game.save()            
                return res.send()
            }
        } else{
            return res.status(400).json({
                errorMessage: "You cannot leave a game if you have not joined before"
            })
        }
    }
    
})

module.exports = router