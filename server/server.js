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
        participants: ["111111","333333"],
        maxParticipants: 3,
        messages: [],
    })
    await g1.save()
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
        const {username, isGuest} = socket.handshake.query
        console.log(socket.handshake.query)
        let user = await User.findOne({username})
        console.log("server user ",user)
        if (user === null) {
            console.log("server refuses")
            socket.disconnect(true)
            return;
        } // refuse connectio
        socket.join(username)
        user.isOnline = true;
        console.log("user socket good from server")

        // const tmp = await User.find({})
        // console.log(tmp.map(user => ({
        //     username: user.username,
        //     isGuest: user.isGuest, 
        //     isOnline: user.isOnline,
        // })))
        
        await user.save()
        socket.on("disconnect", async (reason)=>{
            console.log(reason)
            if (!isGuest){
                user.isOnline = false;
                await user.save()
            }else if (reason === "client namespace disconnect"){
                // so only if a guest user logged out manually we remove it
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


