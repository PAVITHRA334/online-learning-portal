import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import "./courseDetails.css";

const CourseDetails = () => {
  const { courseId } = useParams();
  const { loggedIn, user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(`http://localhost:5000/courses/${courseId}`, { headers });
        setCourse(response.data);
        setIsEnrolled(response.data.enrolled);

        if (response.data.enrolled) {
          const progressResponse = await axios.get(`http://localhost:5000/api/enrollment/${courseId}`, { headers });
          setCompletedLessons(progressResponse.data.completedLessons || []);
          setProgress(progressResponse.data.progress || 0);
        }
      } catch (err) {
        setError("Failed to load course details.");
        console.error("Error loading course details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, loggedIn, user]);

  const handleEnroll = async () => {
    try {
      const storedToken = localStorage.getItem("token"); 
      if (!storedToken) {
        alert("You need to log in first!");
        return;
      }
  
      console.log("📢 Sending token:", storedToken); // Debugging
  
      const response = await axios.post(
        `http://localhost:5000/api/enroll/${courseId}`,
        {}, 
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
  
      alert(response.data.message);
      setIsEnrolled(true);  // ✅ Update UI immediately
    } catch (err) {
      console.error("🚨 Enrollment error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Enrollment failed. Please try again.");
    }
  };
  
const handleCompleteLesson = async (lessonId) => {
  if (!isEnrolled) return alert("⚠️ Enrollment required to complete lessons.");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Authentication required. Please log in again.");
      return;
    }

    const response = await axios.post(  // ✅ Ensure it's a POST request
      "http://localhost:5000/api/progress/update",
      { courseId, lessonId },  // ✅ Send data in the request body
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      setCompletedLessons((prev) => [...prev, lessonId]);
      alert("🎉 Lesson marked as completed!");
    } else {
      throw new Error("Unexpected API response");
    }

  } catch (err) {
    console.error("Error updating progress:", err.response ? err.response.data : err);
    alert("⚠️ Failed to update progress.");
  }
};





  if (loading) return <p className="loading">⏳ Loading course details...</p>;
  if (error) return <p className="error">❌ {error}</p>;

  return (
    <div className="course-container">
      {selectedLesson ? (
        <div className="lesson-container">
          <button className="back-btn" onClick={() => setSelectedLesson(null)}>⬅ Back to Course</button>
          <h3 className="lesson-title">📖 {selectedLesson.title}</h3>
          {selectedLesson.videoUrl ? (
            <video src={selectedLesson.videoUrl} controls className="lesson-video" />
          ) : (
            <p className="no-content">🚫 No video available</p>
          )}
          {selectedLesson.pdfUrl ? (
            <a href={selectedLesson.pdfUrl} target="_blank" rel="noopener noreferrer" className="pdf-link">
              📄 View PDF
            </a>
          ) : (
            <p className="no-content">🚫 No PDF available</p>
          )}
          {!completedLessons.includes(selectedLesson._id) && (
            <button className="complete-btn" onClick={() => handleCompleteLesson(selectedLesson._id)}>✔ Mark as Completed</button>
          )}
        </div>
      ) : (
        <>
          <div className="course-header">
            <img src={course.imageUrl} alt={course.title} className="course-img" />
            <div className="course-info">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p className="course-duration">⏳ Duration: {course.duration} hours</p>
              {!isEnrolled ? (
                <button className="enroll-btn" onClick={handleEnroll}>🎓 Enroll Now</button>
              ) : (
                <p className="enrolled-msg">✅ You are enrolled!</p>
                
              )}
            </div>
          </div>

          {isEnrolled && (
            <div className="progress-container">
              <p className="progress-text">📈 Progress: {progress}%</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          <h3 className="module-heading">📚 Course Modules</h3>
          {course.modules?.length > 0 ? (
            <div className="module-container">
              {course.modules.map((module, index) => (
                <div key={index} className="module-card">
                  <h4>{module.title}</h4>
                  <ul>
                    {module.units.map((unit, uIndex) => (
                      <li
                        key={uIndex}
                        className={`lesson-item ${isEnrolled ? "clickable" : "locked"}`}
                        onClick={() => isEnrolled && setSelectedLesson(unit)}
                      >
                        {isEnrolled ? (completedLessons.includes(unit._id) ? "✅ " : "📖 ") : "🔒 "} 
                        {unit.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-modules">No modules available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default CourseDetails;
