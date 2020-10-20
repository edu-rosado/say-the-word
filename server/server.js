if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose")
// Routers
const authRouter = require("./routes/auth")

mongoose.connect(process.env.DB_URI,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
     }, ()=>{
    console.log("Connected to DB")
})

// Middleware
app.use(express.json())

app.use("/api/user", authRouter)

app.listen(process.env.PORT || 5000);

const User = require("./models/User")

// // Flush DB for dev purporses. TODO: Remove
// User.deleteMany({},()=>console.log("DB flushed"))

const io = require("socket.io")(5001)
io.on("connection", socket =>{
    const {username, isGuest} = socket.handshake.query
    console.log(username, isGuest, isGuest === true)
    socket.join(username)

    socket.on("disconnect", ()=>{
        if (isGuest === "true"){
            User.deleteOne({username: username}, function (err) {
                if(err) console.log(err);
                console.log("Successful deletion");
              });
        }
        console.log(username + " disconnected")
    })
})