const getAllJobs = async (req, res) => {
    res.status(200).json("all jobs")
}

const getSingleJob = async (req, res) => {
    res.status(200).json("single job")
}

const createJob = async (req, res) => {
    res.status(200).json("create job")
}

const updateJob = async (req, res) => {
    res.status(200).json("update job")
}

const deleteJob = async (req, res) => {
    res.status(200).json("delete job")
}

module.exports = {
    getAllJobs,
    getSingleJob,
    createJob,
    updateJob,
    deleteJob
}
