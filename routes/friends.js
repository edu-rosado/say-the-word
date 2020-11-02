const router = require("express").Router();
const User = require("../models/User")
const {verifyToken} = require("../common")

router.post("/", verifyToken, async (req,res)=>{
    let field = "username"
    if (req.body.field === "BY_EMAIL"){
        field = "email"
    }
    const query = {}
    query[field] = req.body.selectedValue
    const potentialFriend = await User.findOne(query)
    if (!potentialFriend){
        return res.status(404).send("User with the provided credentials does not exist")
    } else if (potentialFriend.isGuest){
        return res.status(404).send("You cannot add a guest user as a friend, full account is needed")
    }
    const selfUser = await User.findOne({username: req.user.username})
    if (selfUser.friends.find(name => name == potentialFriend.username) !== undefined){
        return res.status(400).send("User is already a friend")
    } else{
        selfUser.friends.push(potentialFriend.username)
        selfUser.save()
        return res.status(200).json({username: potentialFriend.username})
    }

    
})

router.get("/", verifyToken, async (req,res)=>{
    const found = await User.findOne({username: req.user.username})
    return res.status(200).json(found.friends)
})

module.exports = router;