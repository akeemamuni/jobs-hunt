const mongoose = require("mongoose")
const connectDB = require("../databases/mongo")
const { MongoMemoryServer } = require("mongodb-memory-server")
const User = require("../models/user")

describe("Authentication testing", () => {
    // Setup
    let mongoServer
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        const db = await connectDB(mongoUri)
        expect(db).toBeDefined()
    })
    // beforeEach(async () => {
    //     const mongoUri = mongoServer.getUri()
    //     const db = await connectDB(mongoUri)
    //     expect(db).toBeDefined()
    // })
    // afterEach(async () => {
    //     await mongoose.disconnect()
    // })
    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })
    // Test
    test("Should register a user", async () => {
        const reqBody = {
            name: "Test User",
            email: "user@email.com",
            password: "TestUser101@"
        }
        const newUser = await User.create(reqBody)
        expect(newUser).not.toBe(null)
    })
    test("Should login a user", async () => {
        let verified
        const reqBody = {
            email: "user@email.com",
            password: "TestUser101@"
        }
        const user = await User.findOne({email: reqBody.email})
        expect(user).not.toBe(null)
        verified = await user.verifyPassword(reqBody.password)
        expect(verified).toBe(true)
        const token = user.createToken()
        console.log(token)
        expect(token).not.toBe(null)
    })
})
