const getDateTime = require("../utils/time")
const { StatusCodes: sc } = require('http-status-codes')

const notFound = (req, res) => res.status(404).send("Page not found...")

const customError = (message, status) => {
    const error = new Error(message)
    error.status = status
    return error
}

// Custom error classes
class BadReqError extends Error {
    constructor() {
        super("One or more fields wrong, please input valid details..")
        this.status = sc.BAD_REQUEST
    }
}

class UnauthError extends Error {
    constructor() {
        super("Invalid credentials, please input valid email and password..")
        this.status = sc.UNAUTHORIZED
    }
}

class InvalidAuthError extends Error {
    constructor() {
        super("Invalid token/authorization..")
        this.status = sc.UNAUTHORIZED
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.status = sc.NOT_FOUND
    }
}

// Error handler function
const errorHandler = (err, req, res, next) => {
    const currTime = getDateTime()
    console.log(currTime, err)

    let customErr = {
        message: err.message || "There was an error, please try again later..",
        status: err.status || sc.INTERNAL_SERVER_ERROR
    }
    if (err.name === "CastError") {
        // console.log(Object.values(err.errors))
        customErr.message = `No item found with id: ${err.value}`
        customErr.status = sc.NOT_FOUND
    }
    if (err.code && err.code === 11000) {
        // console.log(Object.values(err.errors))
        customErr.message = `This ${Object.keys(err.keyValue)} has been used..`
        customErr.status = sc.BAD_REQUEST
    }
    if (err.name === "ValidationError") {
        // console.log(Object.values(err.errors))
        customErr.message = Object.values(err.errors).map(item => item.message).join(' & ')
        customErr.status = sc.BAD_REQUEST
    }

    res.status(customErr.status).json(customErr.message)
}

module.exports = {
    notFound,
    errorHandler,
    customError,
    BadReqError,
    UnauthError,
    NotFoundError,
    InvalidAuthError
}
