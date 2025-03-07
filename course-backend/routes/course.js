const express = require("express");
const multer = require("multer");
const Course = require("../models/Course");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses", details: err.message });
  }
});
router.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Error fetching course", details: err.message });
  }
});
router.post("/courses", upload.fields([{ name: "videos" }, { name: "pdfs" }]), async (req, res) => {
  try {
    const { title, description, price, imageUrl, modules, duration } = req.body;
    
    if (!title || !description || !price || !imageUrl || !modules) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const parsedModules = JSON.parse(modules);
    if (req.files) {
      parsedModules.forEach((module) => {
        module.units.forEach((unit, index) => {
          unit.videoUrl = req.files["videos"]?.[index]?.path || "";
          unit.pdfUrl = req.files["pdfs"]?.[index]?.path || "";
        });
      });
    }

    const newCourse = new Course({
      title,
      description,
      price,
      imageUrl,
      duration: duration || "1 month",
      modules: parsedModules,
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (err) {
    res.status(500).json({ error: "Error creating course", details: err.message });
  }
});
router.put("/courses/:id", upload.fields([{ name: "videos" }, { name: "pdfs" }]), async (req, res) => {
  try {
    const { title, description, price, imageUrl, modules, duration } = req.body;
    
    if (!title || !description || !price || !imageUrl || !modules) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const parsedModules = JSON.parse(modules);
    if (req.files) {
      parsedModules.forEach((module) => {
        module.units.forEach((unit, index) => {
          unit.videoUrl = req.files["videos"]?.[index]?.path || unit.videoUrl;
          unit.pdfUrl = req.files["pdfs"]?.[index]?.path || unit.pdfUrl;
        });
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, price, imageUrl, duration, modules: parsedModules },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (err) {
    res.status(500).json({ error: "Error updating course", details: err.message });
  }
});

router.delete("/courses/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting course", details: err.message });
  }
});

module.exports = router;
