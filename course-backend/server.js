const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');
const User = require('./models/User'); // Ensure User model is imported
const quizRoutes = require("./routes/quiz"); 
const courseRoutes = require("./routes/course");
const authRoutes = require("./routes/authRoutes"); // Fix import
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const progressRoutes = require("./routes/progressRoutes");
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
dotenv.config(); 
const uploadDirs = ["uploads", "uploads/images"];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.mimetype.startsWith("image/") ? "uploads/images" : "uploads";
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });
mongoose.connect('mongodb://localhost:27017/learningPlatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({ message: 'Error fetching course details', error });
  }
});

app.post('/courses', upload.fields([
  { name: 'videos', maxCount: 10 },
  { name: 'pdfs', maxCount: 10 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    let { title, description, price, imageUrl, duration, modules } = req.body;
    price = Number(price);
    if (isNaN(price)) {
      return res.status(400).json({ message: 'Price must be a valid number' });
    }

    if (typeof modules === 'string') {
      try {
        modules = JSON.parse(modules);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid modules format' });
      }
    }

    const videoFiles = req.files?.videos || [];
    const pdfFiles = req.files?.pdfs || [];
    const imageFile = req.files?.image ? req.files.image[0].filename : imageUrl;

    const newCourse = new Course({
      title,
      description,
      price,
      imageUrl: imageFile,
      duration,
      modules: Array.isArray(modules) ? modules : [],
      videos: videoFiles.map(file => file.filename),
      pdfs: pdfFiles.map(file => file.filename),
    });

    await newCourse.save();
    res.status(201).json({ message: '✅ Course uploaded successfully', course: newCourse });
  } catch (error) {
    console.error('❌ Error uploading course:', error);
    res.status(500).json({ message: 'Error uploading course', error });
  }
});

app.put('/courses/:id', upload.fields([
  { name: 'videos', maxCount: 10 },
  { name: 'pdfs', maxCount: 10 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  const { id } = req.params;
  const { title, description, price, imageUrl, modules } = req.body;
  const videoFiles = req.files?.videos || [];
  const pdfFiles = req.files?.pdfs || [];
  const imageFile = req.files?.image ? req.files.image[0].filename : imageUrl;

  try {
    let parsedModules = [];
    if (typeof modules === 'string') {
      try {
        parsedModules = JSON.parse(modules);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid modules format' });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        imageUrl: imageFile,
        modules: parsedModules,
        videos: videoFiles.map(file => file.filename),
        pdfs: pdfFiles.map(file => file.filename)
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course', error });
  }
});
app.delete('/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "✅ Course deleted successfully" });
  } catch (error) {
    console.error('❌ Error deleting course:', error);
    res.status(500).json({ message: "Error deleting course", error });
  }
});
app.post('/quizzes', async (req, res) => {
  try {
    const { title, description, level, questions } = req.body;

    if (!title || !description || !level || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Invalid data for quiz. Please include title, description, level, and questions.' });
    }

    const newQuiz = new Quiz({ title, description, level, questions });
    await newQuiz.save();
    res.status(201).json({ message: 'Quiz uploaded successfully', quiz: newQuiz });
  } catch (error) {
    console.error('Error uploading quiz:', error);
    res.status(500).json({ message: 'Error uploading quiz', error });
  }
});

app.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Error fetching quizzes', error });
  }
});
app.put('/quizzes/:id', async (req, res) => {
  try {
    const quizId = req.params.id;
    const { title, description, level, questions } = req.body;
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { title, description, level, questions },
      { new: true, runValidators: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Failed to update quiz', error });
  }
});

app.get('/dashboard/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Invalid instructor ID' });
    }

    const instructor = await User.findById(id)
      .populate('uploadedCourses')
      .populate('uploadedQuizzes')
      .lean(); 

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.status(200).json({
      uploadedCourses: instructor.uploadedCourses || [],
      uploadedQuizzes: instructor.uploadedQuizzes || [],
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
app.use("/api/quiz", quizRoutes); 
app.use("/api/course", courseRoutes); 
app.use("/api", authRoutes);
const enrollRoutes = require("./routes/enrollRoutes");

app.use("/api/enroll", enrollRoutes);
app.use("/api/progress", progressRoutes);


app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a user
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: '✅ User deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE user role
app.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: '✅ Role updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// DELETE a quiz
app.delete('/quizzes/:id', async (req, res) => {
  try {
    const quizId = req.params.id;
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    if (!deletedQuiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json({ message: '✅ Quiz deleted successfully' });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});
const authenticate = require("./middleware/authenticate");
const Enrollment = require("./models/Enrollment");

app.get("/api/enrolled-courses", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const enrollments = await Enrollment.find({ user: userId }).populate("course");

    const courses = enrollments.map((enrollment) => {
      // Flatten all lessons from modules.units into one array
      const lessons = (enrollment.course.modules || []).reduce((acc, module) => {
        return acc.concat(module.units || []);
      }, []);

      return {
        courseId: {
          _id: enrollment.course._id,
          title: enrollment.course.title,
          imageUrl: enrollment.course.imageUrl,
          description: enrollment.course.description,
          lessons, // flat lessons array here
        },
      };
    });

    res.json(courses);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Failed to fetch enrolled courses." });
  }
});


app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
}); 