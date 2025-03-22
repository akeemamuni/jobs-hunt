const { StatusCodes: sc } = require("http-status-codes")
const { BadReqError } = require("../middlewares/error")
const User = require("../models/user")

const login = async (req, res) => {
    return res.status(200).json("This is the login page..")
}
// Register a new user
const register = async (req, res) => {
    // const { name, email, password } = req.body
    // if (!name || !email || !password) throw new BadReqError
    try {
        const regUser = await User.create(req.body)
        return res.status(sc.CREATED).json({token: regUser.createToken()})
    } catch (error) {
        console.log(error)
        throw new BadReqError
    }
}

module.exports = { login, register }
