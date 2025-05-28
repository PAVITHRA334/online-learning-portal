const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");
const Progress = require("../models/Progress");
const Lesson = require("../models/Course"); // Ensure Lesson is imported

// ✅ Corrected API Endpoint
router.post("/update", authenticateUser, async (req, res) => {
    try {
        const { courseId, lessonId } = req.body;
        const userId = req.user.id;

        let progress = await Progress.findOne({ user: userId, course: courseId });

        if (!progress) {
            progress = new Progress({ user: userId, course: courseId, completedLessons: [] });
        }

        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
        }

        // ✅ Ensure totalLessons count works
        const totalLessons = await Lesson.countDocuments({ course: courseId });
        progress.progress = totalLessons > 0 ? (progress.completedLessons.length / totalLessons) * 100 : 0;

        await progress.save();
        res.json({ success: true, progress: progress.progress });

    } catch (err) {
        console.error("🚨 Server error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
