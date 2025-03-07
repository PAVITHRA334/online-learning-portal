const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const Course = require("../models/Course");

router.get("/instructor/courses/:instructorId", async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.params.instructorId });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});
router.get("/instructor/quizzes/:instructorId", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ instructorId: req.params.instructorId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});
//
module.exports = router;
