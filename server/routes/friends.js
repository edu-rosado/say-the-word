const router = require("express").Router();
const User = require("../models/User")
const {verifyToken} = require("../common")

router.post("/", verifyToken, async (req,res)=>{
    console.log(req.user.username)
    const potentialFriend = await User.findOne({username: req.body.username})
    if (potentialFriend){
        const selfUser = await User.findOne({username: req.user.username})
        if (selfUser.friends.find(name => name == req.body.username) !== undefined){
            return res.status(400).send("User is already a friend")
        } else{
            selfUser.friends.push(req.body.username)
            selfUser.save()
            return res.status(200).send()
        }
    }
    return res.status(404).send("User does not exist")
})

router.get("/", verifyToken, async (req,res)=>{
    const found = await User.findOne({username: req.user.username})
    return res.status(200).json(found.friends)
})

module.exports = router;