require("dotenv").config()
require("express-async-errors")

const express = require("express")
const getDateTime = require("./utils/time")
const connectDB = require("./databases/mongo")
const authRouter = require("./routers/authRoute")
const jobsRouter = require("./routers/jobsRoute")
const authMiddleware = require("./middlewares/auth")
const { notFound, errorHandler } = require("./errors/error")

const YAML = require("yamljs")
const swagger = require("swagger-ui-express")
const cors = require("cors")
const xss = require("xss-clean")
const helmet = require("helmet")
const { rateLimit } = require("express-rate-limit")

const swaggerDocs = YAML.load("./docs.yaml") 
const expLimiter = rateLimit({
    limit: 10,
    windowMs: 15 * 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false
})

const app = express()

// Security/Static/Parsing
app.use(expLimiter)
app.use(express.static("./public"))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

// Docs & Routes
app.use("/docs", swagger.serve, swagger.setup(swaggerDocs))
app.use("/api/v1/jobs", authMiddleware, jobsRouter)
app.use("/api/v1/auth", authRouter)

// Errors
app.use(notFound)
app.use(errorHandler)

// Start function
const port = process.env.PORT || 8000
const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI)
        app.listen(port, () => {
            const currTime = getDateTime()
            console.log(`${currTime} Listening on port ${port}...`)
        })
    } catch (error) {
        const currTime = getDateTime()
        return console.error(currTime, error)
    }
}

start()
