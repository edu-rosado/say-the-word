const router = require("express").Router();
const User = require("../models/User")
const {verifyToken} = require("../common")

router.get("/", verifyToken, async (req,res)=>{
    const found = await User.find({})
    return res.status(200).json(found.map(contact => contact.username))
})

router.get("/online", verifyToken, async (req,res)=>{
    const found = await User.find({isOnline: true})
    return res.status(200).json(found.map(contact => contact.username))
})

router.get("/suggestions", verifyToken, async (req,res)=>{
    const queryObj = {username : { $regex: new RegExp(req.query.text) }}
    const found = await User.find(queryObj)
    return res.status(200).json(found.map(
        user => user.username
    ))
})

module.exports = router;