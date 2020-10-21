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

module.exports = router;