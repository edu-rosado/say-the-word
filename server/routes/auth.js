const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const {validateRegister,validateLogin, validateLoginGuest} = require("../validation")
const jwt = require("jsonwebtoken")
const {jwtSignToHeader, verifyToken} = require("../common")

router.post("/register", async (req,res) =>{
    // validate fields
    const validationRes = validateRegister(req.body);
    if (validationRes.error) {
        let errorMsg = validationRes.error.details[0].message;
        let affectedField = null
        if (errorMsg.search('"username"') > -1){
            affectedField = "username"
            errorMsg = errorMsg.replace('"username"', "Name")
        } else if (errorMsg.search('"email"') > -1){
            affectedField = "email"
            errorMsg = errorMsg.replace('"email"', "Email")
        } else if (errorMsg.search('"password"') > -1){
            affectedField = "password"
            errorMsg = errorMsg.replace('"password"', "Password")
        }
        return res.status(400).json({
            affectedField, errorMsg
        })
    }

    // check email unique
    const emailExists = await User.findOne({email: req.body.email})
    if (emailExists) return res.status(400).json({
        affectedField: "email",
        errorMsg: `${req.body.email} is already registered`
    })
    
    // check username unique
    const usernameExists = await User.findOne({username: req.body.username})
    if (usernameExists) {
        return res.status(400).json({
            affectedField: "username",
            errorMsg: `The name '${req.body.username}' is already taken`
        })
    }

    const salt = await bcrypt.genSalt(10)
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password:  await bcrypt.hash(req.body.password, salt),
    })
     try{
         await user.save()
         jwtSignToHeader({
            username: user.username,
            email: user.email
         }, res)
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
        let errorMsg = validationRes.error.details[0].message;
        let affectedField = null
        if (errorMsg.search('"username"') > -1){
            affectedField = "username"
            errorMsg = errorMsg.replace('"username"', "Name")
        } else if (errorMsg.search('"email"') > -1){
            affectedField = "email"
            errorMsg = errorMsg.replace('"email"', "Email")
        } else if (errorMsg.search('"password"') > -1){
            affectedField = "password"
            errorMsg = errorMsg.replace('"password"', "Password")
        }
        return res.status(400).json({
            affectedField, errorMsg
        })
    }

    // check (by email) if user exists
    const user = await User.findOne({email: email})
    if (!user) {
        return res.status(404).json({
            affectedField: "email",
            errorMsg: `${req.body.email} is not registered`
        })
    }
    // compare pwd with hash
    if( !await bcrypt.compare(password, user.password)){
        return res.status(400).json({
            affectedField: "password",
            errorMsg: "Invalid password"
        })
    }
    
    jwtSignToHeader({
        username: user.username,
        email: user.email        
    }, res)
    res.status(200).send() 
});

router.post("/login-guest", async (req,res) =>{
     // validate fields
    const validationRes = validateLoginGuest(req.body);
    if (validationRes.error) {
        const errorMsg = validationRes.error.details[0].message;
        const affectedField = "username"
        return res.status(400).json({
            affectedField, errorMsg
        })
    }

    // check username unique
    const usernameExists = await User.findOne({username: req.body.username})
    if (usernameExists) {
        return res.status(400).json({
            affectedField: "username",
            errorMsg: `The name '${req.body.username}' is already taken`
        })
    }
    
    jwtSignToHeader({
        username: req.body.username,      
    }, res)
    res.status(200).send()
    
});

module.exports = router;
