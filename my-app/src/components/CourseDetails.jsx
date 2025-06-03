import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import "./courseDetails.css";
import swal from 'sweetalert';

const CourseDetails = () => {
  const { courseId } = useParams();
  const { loggedIn, user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);

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
        swal("You need to log in first!");
        return;
      }
  
      console.log("📢 Sending token:", storedToken); // Debugging
  
      const response = await axios.post(
        `http://localhost:5000/api/enroll/${courseId}`,
        {}, 
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
  
     swal(response.data.message);
      setIsEnrolled(true);  // ✅ Update UI immediately
    } catch (err) {
      console.error("🚨 Enrollment error:", err.response?.data || err.message);
      swal(err.response?.data?.error || "Enrollment failed. Please try again.");
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
          
        </div>
      ) : (
        <>
          <div className="course-header">
            <img src={course.imageUrl} alt={course.title} className="course-img" />
            <div className="course-info">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              {!isEnrolled ? (
                <button className="enroll-btn" onClick={handleEnroll}>🎓 Enroll Now</button>
              ) : (
                <p className="enrolled-msg">✅ You are enrolled!</p>
                
              )}
            </div>
          </div>

        

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