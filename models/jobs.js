const mongoose = require("mongoose")

// Mongoose job schema
const JobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, "Please provide name of company.."],
            maxlength: 50,
        },
        position: {
            type: String,
            required: [true, "Please provide position"],
            maxlength: 100,
        },
        status: {
            type: String,
            enum: ["pending", "interviewing", "declined"],
            default: "pending",
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide a user"],
        }
    }, 
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Job", JobSchema)
