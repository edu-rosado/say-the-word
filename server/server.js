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

app.listen(process.env.PORT || 5000);

const User = require("./models/User")


// Flush DB for dev purporses. TODO: Remove
User.deleteMany({},()=>console.log("DB flushed"))

async function myFunc(){
    const bcrypt = require("bcryptjs")
    const salt = await bcrypt.genSalt(10)
new User({
    username: "111111",
    email: "1@1.com",
    password:  await bcrypt.hash("111111", salt),
    isGuest: false,
    isOnline: true,
    friends: ["my", "friends", "are","cool"],
}).save()
new User({
    username: "222222",
    email: "2@1.com",
    password:  await bcrypt.hash("111111", salt),
    isGuest: false,
    isOnline: true,
    friends: ["111"],
}).save()
new User({
    username: "333333",
    email: "3@1.com",
    password:  await bcrypt.hash("111111", salt),
    isGuest: false,
    isOnline: true,
    friends: [],
}).save()
}
myFunc()


const io = require("socket.io")(5001)
io.on("connection", async socket =>{
    const {username, isGuest} = socket.handshake.query
    socket.join(username)
    const user = await User.findOne({username})
    user.isOnline = true;
    await user.save()
    socket.on("disconnect", async (reason)=>{
        user.isOnline = false;
        await user.save()
        if (
            (reason === "client namespace disconnect") && (isGuest === "true")){
            // so only if a guest user logged out manually
            await User.deleteOne({username}, 
                function (err) {if(err) console.log(err);});
        }
    })
})