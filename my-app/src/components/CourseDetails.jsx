import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./courseDetails.css";
const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/courses/${courseId}`);
        setCourse(response.data);
        const enrolledStatus = localStorage.getItem(`enrolled_${courseId}`);
        if (enrolledStatus === "true") {
          setIsEnrolled(true);
        }
      } catch (err) {
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [courseId]);
  const handleEnroll = () => {
    navigate(`/enroll/${courseId}`, { state: { courseId } }); 
  };
  if (loading) return <p className="loading">⏳ Loading course details...</p>;
  if (error) return <p className="error">❌ {error}</p>;
  return (
    <div className="course-container">
      <div className="course-header">
        <img src={course.imageUrl} alt={course.title} className="course-imag" />
        <div className="course-info">
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p className="course-price">💰 Price: Rs.{course.price}/-</p>
          <p className="course-duration">⏳ Duration: {course.duration} hours</p>
          {!isEnrolled ? (
            <button className="enroll-btn" onClick={handleEnroll}>🎓 Enroll Now</button>
          ) : (
            <p className="enrolled-msg">✅ You are enrolled in this course!</p>
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
                    {isEnrolled ? "📖 " : "🔒 "} {unit.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-modules">No modules available.</p>
      )}
      {selectedLesson && isEnrolled && (
        <div className="lesson-container">
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
      )}
    </div>
  );
};

export default CourseDetails;
