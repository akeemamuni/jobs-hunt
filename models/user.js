const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Mongoose user schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: [true, 'Please provide your real name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide a valid email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
    },
    password: {
        type: String,
        minlength: 8,
        required: [true, 'Please provide a password not less than 8 characters'],
    },
})

// Mongoose middleware for hashing password
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Mongoose middleware for generating JWT
UserSchema.methods.createToken = function () {
    const { _id: userId, email } = this
    return jwt.sign(
        {userId, email}, process.env.SECRET, {expiresIn: process.env.EXPIRE}
    )
}

// Compare hashed password
UserSchema.methods.verifyPassword = async function (passwd) {
    return await bcrypt.compare(passwd, this.password)
}


module.exports = mongoose.model("User", UserSchema)
