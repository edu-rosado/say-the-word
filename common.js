const GAME_STATUS_WAITING = "GAME_STATUS_WAITING"
const GAME_STATUS_GOING = "GAME_STATUS_GOING"
const GAME_STATUS_ENDED = "GAME_STATUS_ENDED"

const jwt = require("jsonwebtoken")

const jwtSignToHeader = (data, response)=>{
    const token = jwt.sign(data, process.env.JWT_SECRET)
    response.setHeader("Authorization", `Bearer ${token}`)
}

const verifyToken = (req, res, next) =>{
    const authHeader = req.header("Authorization")
    if (!authHeader) {
        return res.status(403).send("You are not logged in")
    }
    
    const authHeaderList = authHeader.split(" ")
    if (authHeaderList.length < 2){
        return res.status(403).send("Invalid token format") // Format is "Bearer <token>"
    }

    try{
        const user = jwt.verify(authHeaderList[1], process.env.JWT_SECRET)
        req.user = user;
        return next()
    } catch{
        return res.status(403).send("Invalid token")
    }
}

const handleValidationErrors = (response, validationRes)=>{
    if (validationRes.error) {
        const errorMsg = validationRes.error.details[0].message
        return response.status(400).json({errorMsg})
    }
    return null
}

function shuffleArray(originalArray) {
    const array = [...originalArray] // Copy
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}


module.exports = {
    jwtSignToHeader,
    verifyToken,
    handleValidationErrors,
    GAME_STATUS_WAITING,
    GAME_STATUS_GOING,
    GAME_STATUS_ENDED,
    shuffleArray
}