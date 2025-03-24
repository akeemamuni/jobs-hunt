const JobSchema = require("../models/jobs")
const { StatusCodes: sc } = require("http-status-codes")
const { BadReqError, InvalidAuthError } = require("../middlewares/error")
const jobs = require("../models/jobs")

const createJob = async (req, res) => {
    try {
        const { company, position } = req.body
        const { userId: createdBy } = req.authUser
        const job = await JobSchema.create({company, position, createdBy})
        return res.status(sc.CREATED).json(job)
    } catch (error) {
        console.log(error)
        throw new BadReqError
    }
}

const getAllJobs = async (req, res) => {
    try {
        const { userId: createdBy } = req.authUser
        const jobs = await JobSchema.find({createdBy})
        return res.status(sc.OK).json({total: jobs.length, jobs})
    } catch (error) {
        console.log(error)
        throw new InvalidAuthError
    }
}

const getJob = async (req, res) => {
    res.status(200).json("single job")
}

const updateJob = async (req, res) => {
    res.status(200).json("update job")
}

const deleteJob = async (req, res) => {
    res.status(200).json("delete job")
}

module.exports = {
    getAllJobs,
    createJob,
    getJob,
    updateJob,
    deleteJob
}
