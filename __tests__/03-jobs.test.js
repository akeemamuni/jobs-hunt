require("dotenv").config()
const mongoose = require("mongoose")
const connectDB = require("../databases/mongo")
const { MongoMemoryServer } = require("mongodb-memory-server")
const User = require("../models/user")
const Job = require("../models/jobs")

describe("Jobs testing", () => {
    // Setup
    let mongoServer
    let verified
    let token
    let user
    let job

    beforeAll(async () => {
        // Initiate database
        mongoServer = await MongoMemoryServer.create()
        // Connect to database
        const mongoUri = mongoServer.getUri()
        const db = await connectDB(mongoUri)
        expect(db).toBeDefined()
        // Register user
        let reqBody = {
            name: "Test User",
            email: "user@email.com",
            password: "TestUser101@"
        }
        const newUser = await User.create(reqBody)
        expect(newUser).not.toBe(null)
        // Login user
        reqBody = {
            email: "user@email.com",
            password: "TestUser101@"
        }
        user = await User.findOne({email: reqBody.email})
        expect(user).not.toBe(null)
        verified = await user.verifyPassword(reqBody.password)
        expect(verified).toBe(true)
        token = user.createToken()
        expect(token).not.toBe(null)
    })
    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })
    // Test
    test("Should create new job", async () => {
        job = await Job.create({
            company: "Apple", 
            position: "Intern", 
            createdBy: user._id
        })
        console.log(`New job created\n${job}`)
        expect(job).toBeTruthy()
    })
    test("Should get all jobs", async () => {
        const jobs = await Job.find({createdBy: user._id})
        console.log(`All jobs created\n${jobs}`)
        expect(jobs).toBeTruthy()
    })
    test("Should get a job", async () => {
        const singleJob = await Job.findOne({
            _id: job._id, createdBy: user._id
        })
        console.log(`Single job\n${singleJob}`)
        expect(singleJob).toBeTruthy()
    })
    test("Should update a job", async () => {
        const updateJob = await Job.findOneAndUpdate(
            {_id: job._id, createdBy: user._id},
            {status: "interviewing"}, 
            {new: true, runValidators: true}
        )
        console.log(`Updated job\n${updateJob}`)
        expect(updateJob).toBeTruthy()
    })
    test("Should delete a job", async () => {
        const deleteJob = await Job.findOneAndDelete({
            _id: job._id, createdBy: user._id
        })
        console.log(`Deleted job\n${deleteJob}`)
        expect(deleteJob).toBeTruthy()
    })
    test("Should confirm job has been deleted", async () => {
        const deletedJob = await Job.findOne({
            _id: job._id, createdBy: user._id
        })
        console.log(deletedJob)
        expect(deletedJob).toBeFalsy()
    })
})
