const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [{ type: String }], // Array of completed lesson IDs
}, { timestamps: true });

module.exports = mongoose.model("Progress", ProgressSchema);
