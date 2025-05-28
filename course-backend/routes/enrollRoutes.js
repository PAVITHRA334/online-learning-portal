const express = require("express");
const router = express.Router();
const authenticateUser = require("../authMiddleware");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Enroll in a course
router.post("/:courseId", authenticateUser, async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?.userId;  // Ensure userId is properly extracted

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Missing user ID in token" });
        }

        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Check if the user is already enrolled
        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (existingEnrollment) {
            return res.status(400).json({ error: "Already enrolled in this course" });
        }

        // Create new enrollment
        const newEnrollment = new Enrollment({ user: userId, course: courseId, progress: 0, status: "active" });
        await newEnrollment.save();

        res.status(201).json({ message: "Successfully enrolled!", enrollment: newEnrollment });
    } catch (error) {
        console.error("Enrollment Error:", error);
        res.status(500).json({ error: "Failed to enroll" });
    }
});

module.exports = router;
