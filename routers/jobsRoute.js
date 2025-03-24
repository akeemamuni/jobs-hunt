const express = require("express")
const router = express.Router()

const { 
    getAllJobs, createJob,
    getJob, updateJob, deleteJob
} = require("../controllers/jobsController")

router.route("/").post(createJob).get(getAllJobs)
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob)

module.exports = router
