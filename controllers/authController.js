const { StatusCodes: sc } = require("http-status-codes")
const { UnauthError } = require("../errors/error")
const User = require("../models/user")

// Register new user
const register = async (req, res) => {
    const regUser = await User.create({...req.body})
    res.status(sc.CREATED).json(`${regUser.name}'s account created..`)
}

// Login a user
const login = async (req, res) => {
    const { email, password } = req.body
    const regUser = await User.findOne({email})
    if (!regUser) throw new UnauthError
    const verified = await regUser.verifyPassword(password)
    if (!verified) throw new UnauthError
    res.status(sc.OK).json({name: regUser.name, token: regUser.createToken()})
}

module.exports = { login, register }
