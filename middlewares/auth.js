const jwt = require("jsonwebtoken")
const { UnauthError } = require("./error")

const authMiddleware = async (req, res, next) => {
    const { authorization: authHeader } = req.headers
    try {
        if (!authHeader || !authHeader.startsWith("Bearer ")) throw new UnauthError
        req.decoded = jwt.verify(authHeader.split(" ")[1], process.env.SECRET)
        return next()
    } catch (error) {
        throw new UnauthError
    }
}

module.exports = authMiddleware
