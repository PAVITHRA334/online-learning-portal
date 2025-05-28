const Enrollment = require("../models/Enrollment");

const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user?.userId; // Check if extracted correctly

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID in token" });
    }

    const enrollments = await Enrollment.find({ user: userId }).populate("course");
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching enrolled courses." });
  }
};


module.exports = { getEnrolledCourses };
