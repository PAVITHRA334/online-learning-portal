const express = require("express");
const multer = require("multer");
const Course = require("../models/Course");
const authenticateUser = require("../authMiddleware");
const Enrollment = require("../models/Enrollment");
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

// Get all courses (public)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'username email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses", details: err.message });
  }
});

// Get single course (public)
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'username email');
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Error fetching course", details: err.message });
  }
});

// Create course (instructor only)
router.post("/", authenticateUser, upload.fields([{ name: "videos" }, { name: "pdfs" }]), async (req, res) => {
  try {
    // Check if user is an instructor
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ error: "Only instructors can create courses" });
    }

    const { title, description, price, imageUrl, modules, duration } = req.body;
    
    if (!title || !description || !price || !modules) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const parsedModules = JSON.parse(modules);
    
    // Handle file uploads for each module
    if (req.files) {
      parsedModules.forEach((module) => {
        module.units.forEach((unit, index) => {
          if (req.files["videos"]?.[index]) {
            unit.videoUrl = req.files["videos"][index].path;
          }
          if (req.files["pdfs"]?.[index]) {
            unit.pdfUrl = req.files["pdfs"][index].path;
          }
        });
      });
    }

    const course = new Course({
      title,
      description,
      price,
      imageUrl,
      modules: parsedModules,
      duration,
      instructor: req.user.userId
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: "Error creating course", details: err.message });
  }
});

// Update course (instructor only)
router.put("/:id", authenticateUser, upload.fields([{ name: "videos" }, { name: "pdfs" }]), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Verify instructor ownership
    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized - not the course instructor" });
    }

    const { title, description, price, imageUrl, modules, duration } = req.body;
    
    const updates = {
      title,
      description,
      price,
      imageUrl,
      duration
    };

    if (modules) {
      const parsedModules = JSON.parse(modules);
      if (req.files) {
        parsedModules.forEach((module) => {
          module.units.forEach((unit, index) => {
            if (req.files["videos"]?.[index]) {
              unit.videoUrl = req.files["videos"][index].path;
            }
            if (req.files["pdfs"]?.[index]) {
              unit.pdfUrl = req.files["pdfs"][index].path;
            }
          });
        });
      }
      updates.modules = parsedModules;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('instructor', 'username email');

    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: "Error updating course", details: err.message });
  }
});

// Delete course (instructor only)
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Verify instructor ownership
    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized - not the course instructor" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting course", details: err.message });
  }
});

module.exports = router;