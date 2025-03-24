require("dotenv").config()
require("express-async-errors")
const express = require("express")
const connectDB = require("./databases/mongo")
const authRouter = require("./routers/authRoute")
const jobsRouter = require("./routers/jobsRoute")
const authMiddleware = require("./middlewares/auth")
const { notFound, errorHandler } = require("./middlewares/error")

const app = express()

// Port
const port = process.env.PORT || 8005

// Public Middleware  Route
// app.use(express.static("./public"))
app.use(express.json())
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authMiddleware, jobsRouter)
app.use(notFound)
app.use(errorHandler)

// Start function
const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI)
        app.listen(port, console.log(`Listening on port ${port}...`))
    } catch (error) {
        console.error(error)
        return
    }
}

start()
