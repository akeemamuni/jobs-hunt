// 
require("dotenv").config()
require("express-async-errors")
const express = require("express")
const connectDB = require("./databases/mongo")
const authRouter = require("./routers/authRoute")
const jobsRouter = require("./routers/jobsRoute")
const authMiddleware = require("./middlewares/auth")
const { notFound, errorHandler } = require("./errors/error")

// App/Port
const app = express()
const port = process.env.PORT || 8000

// Security/Middleware/Route/Docs
const cors = require("cors")
const xss = require("xss-clean")
const helmet = require("helmet")
const { rateLimit } = require("express-rate-limit")

const swagger = require("swagger-ui-express")
const YAML = require("yamljs")

const expLimiter = rateLimit({
    limit: 100,
    windowMs: 15 * 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false
})

app.use(express.json())
app.use(expLimiter)
app.use(helmet())
app.use(cors())
app.use(xss())

const swaggerDocs = YAML.load("./docs.yaml") 

app.get("/", (req, res) => res.send("<h1>Job Hunting 101</h1><a href='/docs'>Documentation</a>"))
app.use("/docs", swagger.serve, swagger.setup(swaggerDocs))
app.use("/api/v1/jobs", authMiddleware, jobsRouter)
app.use("/api/v1/auth", authRouter)

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
