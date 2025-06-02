const mongoose = require("mongoose"); 
const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  modules: [
    {
      title: String,
      units: [
        {
          title: String,
          videoUrl: String, 
          pdfUrl: String,   
        },
      ],
    },
  ],
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;