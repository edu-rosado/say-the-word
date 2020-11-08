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
    const minParticipants = Math.max(4, participants.length)

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
        points: Object.assign({},
            ...participants.map(name => (
                {[name]: 0}
            ))),
        roles: Object.assign({},
            ...participants.map(name => (
                {[name]: null}
            ))),
        votes: Object.assign({},
            ...participants.map(name => (
                {[name]: []}
            ))),
        followingUp: Object.assign({},
            ...participants.map(name => (
                {[name]: false}
            ))),
        host: req.user.username,
        status: GAME_STATUS_WAITING,
    })
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
        followingUp: game.followingUp, 
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
            if (game.status === GAME_STATUS_ENDED){
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
                    roles: game.roles,
                    impostorFriend,
                    followingUp: game.followingUp,
                }
            } else {
                const filteredRoles = {}
                filteredRoles[req.user.username] = role
                const filteredVotes = {}
                filteredVotes[req.user.username] = game.votes[req.user.username]
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
                    votes: filteredVotes,
                    roles: filteredRoles,
                    impostorFriend,
                    followingUp: game.followingUp,
                }
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
        case "follow-up":
            ({status, jsonResponse} = await followUp(req, user, game))
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
    } else if (game.status !== GAME_STATUS_WAITING){
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
            game.followingUp[user.username] = false
            game.markModified("roles")
            game.markModified("points")
            game.markModified("votes")
            game.markModified("followingUp")
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
        const {role, impostorFriend} = setUpNewGame(game, user)
        game.markModified("roles")
        game.markModified("votes")
        await game.save()
        return {status: 200, jsonResponse: {
            role, impostorFriend
        }}
    }
}

function setUpNewGame(game, user){
    game.status = GAME_STATUS_GOING
    const newOrder = shuffleArray(game.participants)
    newOrder.slice(0,2).forEach(name => {
        game.roles[name] = "impostor"
        delete game.votes[name]
    })
    newOrder.slice(2).forEach(name => {
        game.roles[name] = "true self"
        game.votes[name] = []
    })
    const role = game.roles[user.username]
    let impostorFriend = null
    if (role === "impostor"){
        impostorFriend = Object
            .entries(game.roles)
            .filter(([name,nameRole]) =>(
                (name !== user.username) &&
                nameRole === "impostor"
            ))[0][0]
    }
    return {role, impostorFriend}
}

async function vote(req, user, game){
    console.log(user)
    console.log(game)
    console.log(req.params.gameId)
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
        }
        game.votes[user.username] = req.body.votes
        game.markModified("votes")
        const numOfVotesCasted = Object.values(game.votes)
            .reduce((num, voteList) => voteList.length > 0? num + 1 : num, 0)
        if (numOfVotesCasted == game.participants.length - 2){
            // Everyone (except the 2 impostors) have voted, end the game
            game.status = GAME_STATUS_ENDED
            // const nominates = nominate2(game.votes)
            const newPoints = assignPoints(game)
            Object.keys(game.points)
                .forEach(name => {
                    game.points[name] += newPoints[name]
                })
            game.markModified("points")
            jsonResponse.status = game.status
            jsonResponse.votes = game.votes
            jsonResponse.roles = game.roles
            jsonResponse.points = game.points
        }
        await game.save()
        return {status: 200, jsonResponse}
    }
}

function assignPoints(game){
    const points = {}
    game.participants.forEach(name => {points[name] = 0})
    const votesPerImpostor = {}
    Object.entries(game.roles)
        .filter(entry => entry[1] === "impostor")
        .forEach(entry => {votesPerImpostor[entry[0]] = 0})
    Object.entries(game.votes)
        .forEach(([name,votes]) => {
            votes.forEach(vote =>{
                if (game.roles[vote] === "impostor"){
                    votesPerImpostor[vote] += 1
                    points[name] += 1
                }
            })
        })
    Object.entries(votesPerImpostor)
        .forEach(([impostor, votes]) => {
            if (votes == 0) {
                // If nobody nominates the impostor, 3p
                points[impostor] = 3
            }
            else if (votes < (game.participants.length - 2)) {
                // If someone nominates the impostor, but not everyone does, 1p
                points[impostor] = 1
            } // Else 0p
        })
    return points
}

async function followUp(req, user, game){
    if (!user.games.includes(req.params.gameId)){
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "You are not a participant of this game"
            }
        }
    } else if (game.status !== GAME_STATUS_ENDED){
        return {
            status: 400,
            jsonResponse: {
                errorMessage: "The game has not finished yet"
            }
        }
    }
    game.followingUp[user.username] = true
    let role = null
    let impostorFriend = null
    
    const everyoneIsReady = Object
        .values(game.followingUp)
        .reduce((acc, current) => (acc && current),true)
    if (everyoneIsReady){
        // Restart game
        game.participants.forEach(name =>{
            game.followingUp[name] = false
        })
        const tmp = setUpNewGame(game, user)
        role = tmp.role
        impostorFriend = tmp.impostorFriend
        game.markModified("roles")
        game.markModified("votes")
    }
    game.markModified("followingUp")
    await game.save()
    return {status: 200, jsonResponse: {
        role, impostorFriend
    }}
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