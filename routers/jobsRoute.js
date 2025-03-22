const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth")
const { 
    createJob, getAllJobs, 
    getSingleJob, updateJob, deleteJob
} = require("../controllers/jobsController")


router.route("/").post(createJob).get(authMiddleware, getAllJobs)
router.route("/:id").get(authMiddleware, getSingleJob).patch(authMiddleware, updateJob).delete(authMiddleware, deleteJob)

module.exports = router
