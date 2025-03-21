const mongoose = require("mongoose")

const connectDB = async (MONGO_URI) => {
    db = await mongoose.connect(MONGO_URI)
    return db
}

module.exports = connectDB
