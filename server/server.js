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


