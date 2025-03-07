const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
router.post("/add", async (req, res) => {
    try {
        const { title, description, level, questions, instructorId } = req.body;

        if (!title || !description || !level || !questions || !instructorId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newQuiz = new Quiz({
            title,
            description,
            level,
            questions,
            instructorId
        });

        await newQuiz.save();
        res.status(201).json({ message: "Quiz uploaded successfully!", quiz: newQuiz });
    } catch (err) {
        res.status(500).json({ error: "Failed to upload quiz", details: err });
    }
});

module.exports = router;
