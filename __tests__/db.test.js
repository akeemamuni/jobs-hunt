const mongoose = require("mongoose")
const connectDB = require("../databases/mongo")
const { MongoMemoryServer } = require("mongodb-memory-server")

describe("Database connections", () => {
    // Setup
    let mongoServer
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
    })
    afterEach(async () => {
        await mongoose.disconnect()
    })
    afterAll(async () => {
        await mongoServer.stop()
    })
    // Test
    test("Should connect to database", async () => {
        const mongoUri = mongoServer.getUri()
        const db = await connectDB(mongoUri)
        expect(db).toBeDefined()
        expect(mongoose.connection.readyState).toBe(1)
    })
    test("Should throw error due to wrong URI", () => {
        expect(async () => await connectDB("fakeUri")).rejects.toThrow()
    })
})
