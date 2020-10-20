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

module.exports = {
    jwtSignToHeader,
    verifyToken,
}