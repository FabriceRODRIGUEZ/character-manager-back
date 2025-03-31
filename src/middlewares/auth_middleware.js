import jwt from "jsonwebtoken"


export default function authenticate(req, res, next) {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) return res.status(401).json("Token not provided")
    
    try {
        jwt.verify(token, process.env.TOKEN_SECRET)
    } catch (error) {
        return res.status(401).json("Invalid token")
    }

    const decodedToken = JSON.parse(jwt.decode(token.split(".")))
    req.user = decodedToken.username
    
    next()
}