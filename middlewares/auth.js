const jwt = require("jsonwebtoken")
const { InvalidAuthError } = require("../errors/error")

const authMiddleware = async (req, res, next) => {
    const { authorization: authHeader } = req.headers
    try {
        if (!authHeader || !authHeader.startsWith("Bearer ")) throw new InvalidAuthError
        const auth = jwt.verify(authHeader.split(" ")[1], process.env.SECRET)
        req.authUser = {userId: auth.userId, email: auth.email}
        return next()
    } catch (error) {
        throw new InvalidAuthError
    }
}

module.exports = authMiddleware
