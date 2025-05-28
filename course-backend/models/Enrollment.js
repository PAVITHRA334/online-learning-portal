const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  progress: { type: Number, default: 0 },
  status: { type: String, default: "active" }
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
