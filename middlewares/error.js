const { StatusCodes } = require('http-status-codes')

const errorHandler = (err, req, res, next) => res.status(err.status).json(err.message)
const notFound = (req, res) => res.status(404).send("Page not found...")

const customError = (message, status) => {
    const error = new Error(message)
    error.status = status
    return error
}

class BadReqError extends Error {
    constructor() {
        super("One or more fields wrong, please input valid details..")
        this.status = StatusCodes.BAD_REQUEST
    }
}

class UnauthError extends Error {
    constructor() {
        super("Invalid authorization, please register/login..")
        this.status = StatusCodes.UNAUTHORIZED
    }
}

module.exports = {
    notFound,
    errorHandler,
    customError,
    BadReqError,
    UnauthError
}
