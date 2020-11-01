const { verifyToken } = require("../common")

const router = require("express").Router()
const {words} = require("../words/allWords_spanish.json")
const NUM_OF_WORDS = words.length

router.get("/random", verifyToken, (req,res) =>{
    res.json({
        word: words[Math.floor(Math.random() * NUM_OF_WORDS)]
    })
})

module.exports = router