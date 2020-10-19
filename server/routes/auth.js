const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const {validateRegister,validateLogin} = require("../validation")
const jwt = require("jsonwebtoken")
const {jwtSignToHeader, verifyToken} = require("../common")

router.post("/register", async (req,res) =>{
    // validate fields
    const validationRes = validateRegister(req.body);
    if (validationRes.error) return res.status(400).send(validationRes.error.details[0].message)

    // check email unique
    const emailExists = await User.findOne({email: req.body.email})
    if (emailExists) return res.status(400).send(`${req.body.email} is already registered`)
    
    // check username unique
    const usernameExists = await User.findOne({username: req.body.username})
    if (usernameExists) return res.status(400).send(`The user name '${req.body.username}' is already taken :S`)

    const salt = await bcrypt.genSalt(10)
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password:  await bcrypt.hash(req.body.password, salt),
    })
     try{
         await user.save()
         jwtSignToHeader(user._id, res)
        res.status(200).send()
     } catch{
         res.status(400).send("Data good but DB couldn't save")
     }
});

router.post("/login", async (req,res) =>{
    const {email, password} = req.body;
     // validate fields
    const validationRes = validateLogin(req.body);
    if (validationRes.error) {
        return res.status(400).send(validationRes.error.details[0].message)
    }

    // check (by email) if user exists
    const user = await User.findOne({email: email})
    if (!user) {
        return res.status(404).send("Email not found")
    }

    // compare pwd with hash
    if( !await bcrypt.compare(password, user.password)){
        res.status(400).send("Invalid password")
    }
    
    jwtSignToHeader(user._id, res)
    res.status(200).send()
    
});

router.get("/private", verifyToken, (req,res)=>{
    res.send(`Welcome to the secret area ${req.user._id}`)
})

module.exports = router;
