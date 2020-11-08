const express = require("express");
const app = express();
const server = require("http").Server(app)
const path = require("path")
const {GAME_STATUS_WAITING, GAME_STATUS_GOING} = require("./common")

let io = null;
if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
    io = require("socket.io")(5001)
} else{
    io = require("socket.io")(server)
}

const mongoose = require("mongoose")

// Routers
const authRouter = require("./routes/auth")
const contactsRouter = require("./routes/contacts")
const friendsRouter = require("./routes/friends")
const gamesRouter = require("./routes/games")

mongoose.connect(process.env.DB_URI,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
     }, ()=>{
    console.log("Connected to DB")
})

// Middleware
app.use(express.json())

// Routes
app.use("/api/auth", authRouter)
app.use("/api/friends", friendsRouter)
app.use("/api/contacts", contactsRouter)
app.use("/api/games", gamesRouter)

if (process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"))
    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "client","build", "index.html"))
    })
}

server.listen(process.env.PORT || 5000);

const User = require("./models/User");
const Game = require("./models/Game");

// Fake data for dev purporses
async function myFunc(){
    User.deleteMany({},()=>{})
    Game.deleteMany({},()=>{console.log("Flushed DB")})
    const bcrypt = require("bcryptjs")
    const salt = await bcrypt.genSalt(10)

    // const g1 = await new Game({
    //     title: "game 1",
    //     hasPassword: false,
    //     password: "no_password",
    //     participants: ["111111","222222","333333","444444"],
    //     maxParticipants: 5,
    //     messages: [],
    //     roles: {"111111":null, "222222":null, "333333":null, "444444":null},
    //     points: {"111111":0, "222222":0, "333333":0, "444444":0},
    //     host: "111111",
    //     votes: {"111111":[],"222222":[],"333333":[],"444444":[]},
    //     status: GAME_STATUS_WAITING,
    // })
    const g1 = await new Game({
        title: "game 1",
        hasPassword: false,
        password: "no_password",
        participants: ["111111","222222","333333","444444"],
        maxParticipants: 5,
        messages: [],
        roles: {
            "111111":"true self",
            "222222":"true self",
            "333333":"impostor",
            "444444":"impostor"
        },
        points: {"111111":0, "222222":0, "333333":0, "444444":0},
        host: "111111",
        votes: {
            "111111":[],
            "222222":["111111","444444"]
        },
        followingUp: {"111111":false, "222222":false, "333333":false, "444444":false},
        status: GAME_STATUS_GOING,
    })
    await g1.save()

    const u2 = new User({
        username: "222222",
        email: "2@1.com",
        password:  await bcrypt.hash("111111", salt),
        isGuest: false,
        isOnline: true,
        friends: [],
        games: [g1._id],
    })
    await u2.save()
    const u3 = new User({
        username: "333333",
        email: "3@1.com",
        password:  await bcrypt.hash("111111", salt),
        isGuest: false,
        isOnline: true,
        friends: [],
        games: [g1._id],
    })
    await u3.save()
    const u4 = new User({
        username: "444444",
        email: "4@1.com",
        password:  await bcrypt.hash("111111", salt),
        isGuest: false,
        isOnline: true,
        friends: [],
        games: [g1._id],
    })
    await u4.save()

    const u1 = new User({
        username: "111111",
        email: "1@1.com",
        password:  await bcrypt.hash("111111", salt),
        isGuest: false,
        isOnline: true,
        friends: [u2.username, u3.username],
        games: [g1._id],
    })
    await u1.save()
    console.log("g1: ", g1._id)
}

function setUpSocket(){
    io.on("connection", async socket =>{
        const {username} = socket.handshake.query
        let user = await User.findOne({username})
        if (user === null) {
            return;
        }
        user.isOnline = true;
        await user.save()

        socket.on("join", async (gameId)=>{
            const game = await Game.findOne({_id: gameId})
            if (game && (!Object.keys(socket.rooms).includes(gameId))){
                socket.join(gameId)
                socket.to(gameId).emit("newParticipant", {username, gameId})
            } 
        })

        socket.on("message", ({gameId, msg}) =>{
            socket.to(gameId).emit("message",{gameId, msg})
        })

        socket.on("gameStarted", async ({gameId}) =>{
            socket.to(gameId).emit("gameStarted",{gameId})
        })
        socket.on("getRole", async ({gameId}) => {
            const game = await Game.findOne({_id: gameId})
            const role = game.roles[username]
            let impostorFriend = null
            if (role === "impostor"){
                impostorFriend = Object
                    .entries(game.roles)
                    .filter(([name,nameRole]) =>(
                        (name !== username) &&
                        nameRole === "impostor"
                    ))[0][0]
            }
            socket.to(gameId).emit("getRole", {
                role,
                impostorFriend,
                gameId,
            })
        })
        socket.on("gameEnd", async ({gameId}) => {
            const game = await Game.findOne({_id: gameId})
            socket.to(gameId).emit("gameEnd", {
                gameId,
                votes: game.votes,
                roles: game.roles,
                points: game.points,
            })
        })

        socket.on("disconnect", async (reason)=>{
            if (!user.isGuest){
                user.isOnline = false;
                await user.save()
            }else if (reason === "client namespace disconnect"){
                user = await User.findOne({username}) // get latest user info
                const gamesAffected = await Game.find({
                    _id: {$in: user.games}
                })
                // Perform manual cascade reference removal and finally user removal
                gamesAffected.forEach(async game =>{
                    game.participants.remove(username)
                    if (game.participants.length == 0){
                        await game.remove()
                    } else{
                        await game.save()
                    }
                })
                await user.remove()
            }
        })
    })
}

if (process.env.NODE_ENV === "production"){
    setUpSocket()
} else{
    myFunc().then(() => setUpSocket())
}

