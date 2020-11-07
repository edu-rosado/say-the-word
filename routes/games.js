const router = require("express").Router()
const Game = require("../models/Game")
const {verifyToken, handleValidationErrors} = require("../common")
const {preValidateGame,validateGame, validateParticipantList} = require("../validation")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const {GAME_STATUS_WAITING,GAME_STATUS_GOING,GAME_STATUS_ENDED, shuffleArray} = require("../common")

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
        roles: {},
        votes: {},
        host: req.user.username,
        status: GAME_STATUS_WAITING,
    })
    game.points[req.user.username] = 0
    game.roles[req.user.username] = null
    game.votes[req.user.username] = []
    game.markModified("roles")
    game.markModified("points")
    game.markModified("votes")
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
        host: game.host,  
        status: game.status,  
    })  
})

// Get all games
router.get("/", verifyToken, async (req,res)=>{
    const games = await Game.find({})
    // For games in which the user is a participant, send the messages, don't do it on the rest!
    // TODO: implement a cache for this
    const gamesToReturn = games.map(game => {
        if (game.participants.includes(req.user.username)){
            const role = game.roles[req.user.username]
            let impostorFriend = null
            if (role === "impostor"){
                impostorFriend = Object
                    .entries(game.roles)
                    .filter(([name,nameRole]) =>(
                        (name !== req.user.username) &&
                        nameRole === "impostor"
                    ))[0][0]
            }
            return {
                _id: game._id,
                title: game.title, 
                hasPassword: game.hasPassword, 
                maxParticipants: game.maxParticipants,
                participants: game.participants,
                messages: game.messages,
                points: game.points,
                host: game.host,
                status: game.status,
                votes: game.votes,
                role,
                impostorFriend,
            }
        } else{
            return {
                _id: game._id,
                title: game.title, 
                hasPassword: game.hasPassword, 
                maxParticipants: game.maxParticipants,
                participants: game.participants,
                status: game.status,
            }
        }
    })
    return res.json(gamesToReturn)
})

// Modify a game
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
    let status = null
    let jsonResponse = null    
    switch(req.query.action){
        case "join":
            ({status, jsonResponse} = await joinGame(req, user, game))
            break;
        case "leave":
            ({status, jsonResponse} = await leaveGame(req, user, game))
            break;
        case "start":
            ({status, jsonResponse} = await startGame(req, user, game))
            break;
        case "vote":
            ({status, jsonResponse} = await vote(req, user, game))
            break;
        default:
            status = 400
            jsonResponse = {errorMessage: "Invalid action for the game endpoint"}
    }
    return res.status(status).json(jsonResponse)
})

async function joinGame(req, user, game){
    if (user.games.includes(req.params.gameId)){
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "You already are a participant in the requested game"
            },
        }
    } else if (user.games.status !== GAME_STATUS_WAITING){
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "Game already started"
            },
        }
    } else{
        if (game.participants.length < game.maxParticipants){
            user.games.push(req.params.gameId)
            await user.save()
            game.participants.push(user.username)
            game.roles[user.username] = null
            game.points[user.username] = 0
            game.votes[user.username] = []
            game.markModified("roles")
            game.markModified("points")
            game.markModified("votes")
            await game.save()            
            const jsonResponse = {
                _id: game._id,
                title: game.title, 
                hasPassword: game.hasPassword, 
                maxParticipants: game.maxParticipants,
                participants: game.participants,
                messages: [],
                points: game.points,
                host: game.host,
                status: game.status,
                votes: game.votes,
            }
            return {status: 200, jsonResponse}
        } else{
            return {
                status: 400,
                jsonResponse: {
                    errorMessage: "The game is full, there are no seats available"
                },
            }
        }  
    } 
}

async function leaveGame(req, user, game){
    if (user.games.includes(req.params.gameId)){
        user.games = user.games.filter(gId => (
            ! gId.equals(game._id)
        ))
        await user.save()
        if (game.participants.length == 1){
            await game.remove()
        } else{
            game.participants = game.participants.filter(participant => (
                participant !== user.username
            ))
            delete game.roles[user.username]
            delete game.points[user.username]
            delete game.votes[user.username]
            if (game.host === user.username){
                game.host = game.participants[0]
            }
            game.markModified("roles")
            game.markModified("points")
            game.markModified("votes")
            await game.save()
        }
        
        return {
            status: 200,
            jsonResponse : {_id: game._id}
        }
    } else{
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "You cannot leave a game if you have not joined before"
            },
        }
    }
}

async function startGame(req, user, game){
    if (!user.games.includes(req.params.gameId) || (game.host !== user.username)){
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "Only the host can start the game"
            }
        }
    } else if (game.status === GAME_STATUS_GOING){
        // The game must be in the WAITING state in order to start
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "Game has already started"
            }
        } 
    } else if (game.participants.length < 4){
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "Game must have at least 4 participants"
            }
        } 
    } else{
        game.status = GAME_STATUS_GOING
        const newOrder = shuffleArray(game.participants)
        newOrder.slice(0,2).forEach(name => {
            game.roles[name] = "impostor"
            delete game.votes[name]
        })
        newOrder.slice(2).forEach(name => {
            game.roles[name] = "true self"
        })
        game.markModified("roles")
        game.markModified("votes")

        await game.save()
        const role = game.roles[req.user.username]
        let impostorFriend = null
        if (role === "impostor"){
            impostorFriend = Object
                .entries(game.roles)
                .filter(([name,nameRole]) =>(
                    (name !== req.user.username) &&
                    nameRole === "impostor"
                ))[0][0]
        }
        return {status: 200, jsonResponse: {
            role, impostorFriend

        }}
    }
}

async function vote(req, user, game){
    if (!user.games.includes(req.params.gameId)){
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "You are not a participant of this game"
            }
        }
    } else if (game.status !== GAME_STATUS_GOING){
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "Game is not ready to vote"
            }
        } 
    } else if (req.body.votes.length != 2){
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "You must nominate 2 participants"
            }
        } 
    } else if (game.votes[user.username].length > 0){
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "You already voted"
            }
        } 
    } else if (game.roles[user.username] === "impostor"){
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "Impostors don't vote, duh!"
            }
        } 
    } else{
        let error = null
        req.body.votes.forEach(vote =>{
            if ((vote === user.username) || !game.participants.includes(vote)){
                // Con't nominate yourself or a non-participant
                // If this happens, it is a hacking attempt
                error = {
                    status: 400,
                    jsonResponse: {
                        errorMessage: "Invalid vote"
                    }
                }
            }
        })
        if (error !== null){
            return error
        }
        const jsonResponse = {
            status: GAME_STATUS_GOING,
            votes: null,
            roles: null,
            points: null,
            nominates: null,
        }
        game.votes[user.username] = req.body.votes
        game.markModified("votes")
        const numOfVotesCasted = Object.values(game.votes)
            .reduce((num, voteList) => voteList.length > 0? num + 1 : num, 0)
        if (numOfVotesCasted == game.participants.length - 2){
            // Everyone (except the 2 impostors) have voted, end the game
            game.status = GAME_STATUS_ENDED
            const nominates = nominate2(game.votes)
            const newPoints = assignPoints(game, nominates)
            game.points = Object.keys(game.points)
                .forEach(name => {
                    game.points[name] += newPoints[name]
                })
            game.markModified("points")
            jsonResponse.status = game.status
            jsonResponse.votes = game.votes
            jsonResponse.roles = game.roles
            jsonResponse.points = game.points
            jsonResponse.nominates = nominates
        }
        await game.save()
        return {status: 200, jsonResponse}
    }
}

function nominate2(voter2votes){
    const nominated2votes = {}
    Object.values(voter2votes).forEach(votes =>{
        votes.forEach(vote => {
            if (!Object.keys(nominated2votes).includes(vote)){
                nominated2votes[vote] = 1
            } else{
                nominated2votes[vote] += 1
            }
        })
    })
    let result = Object.entries(nominated2votes)
        .sort((el1,el2) => (el2[1] - el1[1]))
    if ((result.length > 2) && (result[1][1] == result[2][1])){
        // If there is a tie btw 2nd and 3rd, only 1st gets nominates
        result = result.slice(0,1)
    } else{
        // Else, both 1st and 2nd get nominated
        result = result.slice(0,2)
    }
    return result.map(entry => entry[0]) // return the names
}

function assignPoints(game, nominates){
    const newPoints = game.points
    const pointsForTrues = nominates.reduce((points, nominate) =>(
        game.roles[nominate] === "impostor"? points + 1 : points
    ), 0)
    console.log(nominates, game.roles, game.roles["111111"] === "impostor", pointsForTrues)
    game.participants.forEach(participant => {
        if (game.roles[participant] === "impostor"){
            if (!nominates.includes(participant)){
                newPoints[participant] += 2
            }
        }else{
            newPoints[participant] += pointsForTrues
        }
    })
    return newPoints
}

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
        return res.status(200).json({msg})
    } else{
            return res.status(400).json({
                errorMessage: "You are not a participant of the requested game"
            })
    }
})
router.post("/:gameId/impostor-messages", verifyToken, async (req,res)=>{
    let game = null
    try{
        game = await Game.findOne({_id: req.params.gameId})
    }catch{
        return res.status(400).json({
            errorMessage: "The game does not exist"
        })
    }
    const user = await User.findOne({username: req.user.username})
    if (!user.games.includes(req.params.gameId)){
        return res.status(400).json({
            errorMessage: "You are not a participant of the requested game"
        })
    } else if (game.roles[user.username] !== "impostor"){
        return res.status(400).json({
            errorMessage: "You are not an impostor"
        })
    } else{
        const impostorFriend = Object
            .entries(game.roles)
            .filter(([name, nameRole]) => (
                (nameRole === "impostor") && 
                (name !== user.username)
                )
            )[0][0]
        const msg = {
            author: impostorFriend,
            text: req.body.text,
            date: new Date(),
        }
        game.messages.push(msg)
        await game.save()
        return res.status(200).json({msg})
    }            
})


module.exports = router