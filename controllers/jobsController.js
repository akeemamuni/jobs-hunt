const JobSchema = require("../models/jobs")
const { StatusCodes: sc } = require("http-status-codes")
const { BadReqError, NotFoundError } = require("../errors/error")

const createJob = async (req, res) => {
    const { company, position } = req.body
    const { userId: createdBy } = req.authUser
    if (!company || !position || company === "" || position === "") {
        throw new BadReqError
    }
    const job = await JobSchema.create({company, position, createdBy})
    res.status(sc.CREATED).json(job)
}

const getAllJobs = async (req, res) => {
    const { userId: createdBy } = req.authUser
    const jobs = await JobSchema.find({createdBy}).select(
        "company position status"
    )
    if (!jobs) throw new NotFoundError("No job found..")
    res.status(sc.OK).json({total: jobs.length, jobs})
}

const getJob = async (req, res) => {
    const { id: _id } = req.params
    const { userId: createdBy } = req.authUser
    const job = await JobSchema.findOne({_id, createdBy}).select(
        "-createdBy -__v"
    )
    if (!job) throw new NotFoundError(`No job with id: ${_id}`)
    res.status(sc.OK).json(job)
}

const updateJob = async (req, res) => {
    const { params: {id: _id}, authUser: {userId: createdBy} } = req
    const job = await JobSchema.findOneAndUpdate(
        {_id, createdBy}, {...req.body}, 
        {new: true, runValidators: true}
    )
    if (!job) throw new NotFoundError(`No job with id: ${_id}`)
    res.status(sc.OK).json(job)
}

const deleteJob = async (req, res) => {
    const { params: {id: _id}, authUser: {userId: createdBy} } = req
    const job = await JobSchema.findOneAndDelete({_id, createdBy})
    if (!job) throw new NotFoundError(`No job with id: ${_id}`)
    res.status(sc.NO_CONTENT).json(job)
}

module.exports = {
    getAllJobs,
    createJob,
    getJob,
    updateJob,
    deleteJob
}
