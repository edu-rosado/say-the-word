if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}
const express = require("express");
const app = express();
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

app.listen(process.env.PORT || 5000);

const User = require("./models/User");
const Game = require("./models/Game");


// Flush DB for dev purporses. TODO: Remove
User.deleteMany({},()=>{})
Game.deleteMany({},()=>{console.log("Flushed DB")})

async function myFunc(){
    const bcrypt = require("bcryptjs")
    const salt = await bcrypt.genSalt(10)
    const u2 = new User({
        username: "222222",
        email: "2@1.com",
        password:  await bcrypt.hash("111111", salt),
        isGuest: false,
        isOnline: true,
        friends: [],
    })
    await u2.save()
    const u3 = new User({
        username: "333333",
        email: "3@1.com",
        password:  await bcrypt.hash("111111", salt),
        isGuest: false,
        isOnline: true,
        friends: [],
    })
    await u3.save()
    const g1 = await new Game({
        title: "game 1",
        hasPassword: false,
        password: "no_password",
        participants: ["111111","222222"],
        maxParticipants: 3,
        messages: [],
    })
    await g1.save()
    const g2 = await new Game({
        title: "game 2",
        hasPassword: false,
        password: "no_password",
        participants: ["111111","222222"],
        maxParticipants: 3,
        messages: [],
    })
    await g2.save()
    const u1 = new User({
        username: "111111",
        email: "1@1.com",
        password:  await bcrypt.hash("111111", salt),
        isGuest: false,
        isOnline: true,
        friends: [u2.username, u3.username],
        games: [g1]
    })
    await u1.save()
    console.log("g1: ", g1._id)
}

function setUpSocket(){
    const io = require("socket.io")(5001)
    io.on("connection", async socket =>{
        const {username} = socket.handshake.query
        let user = await User.findOne({username})
        if (user === null) {
            return;
        }
        user.isOnline = true;
        await user.save()

        socket.on("join", async (roomId)=>{
            const game = await Game.findOne({_id: roomId})
            if (game){
                game.participants.push(username)
                await game.save()
                socket.join(username)
                socket.to(roomId).emit("newParticipant", username)
                socket.emit("joinAck","All good")
            } else{
                socket.emit("joinAck","Requested game does not exist")
            }
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

// Cargar los datos de prueba antes de aceptar conexiones ws
myFunc().then(()=> setUpSocket())


