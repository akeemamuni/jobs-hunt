const { StatusCodes: sc } = require("http-status-codes")
const { BadReqError, UnauthError } = require("../middlewares/error")
const User = require("../models/user")

// Login a user
const login = async (req, res) => {
    const { email, password } = req.body
    if (email.length < 5 || password.length < 8) throw new BadReqError
    try {
        const regUser = await User.findOne({email})
        if (!regUser) throw new UnauthError
        const verified = await regUser.verifyPassword(password)
        if (!verified) throw new UnauthError
        return res.status(sc.OK).json({
            name: regUser.name, 
            token: regUser.createToken()
        })
    } catch (error) {
        console.log(error)
        throw new UnauthError
    }
}

// Register a new user
const register = async (req, res) => {
    // const { name, email, password } = req.body
    // if (!name || !email || !password) throw new BadReqError
    try {
        const regUser = await User.create(req.body)
        return res.status(sc.CREATED).json(`${regUser.name}'s account created..`)
    } catch (error) {
        console.log(error)
        throw new BadReqError
    }
}

module.exports = { login, register }
