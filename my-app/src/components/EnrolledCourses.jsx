import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

const EnrolledCourses = () => {
  const navigate = useNavigate();
  const { loggedIn } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Stored Token:", token); // Debugging
  
      if (!token) {
        throw new Error("User not logged in (No Token Found)");
      }
  
      const response = await axios.get("http://localhost:5000/api/enrolled-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Full API Response:", response.data); // Debugging
      setCourses(response.data || []);
    } catch (err) {
      console.error("API Error:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Failed to load enrolled courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    fetchEnrolledCourses();
  }, [loggedIn, navigate]);

  if (loading) return <p className="loading">⏳ Loading enrolled courses...</p>;
  if (error) return <p className="error">❌ {error}</p>;

  return (
    <div className="enrolled-container">
      <h2>📚 Your Enrolled Courses</h2>
      {courses.length === 0 ? (
        <p>No enrolled courses found.</p>
      ) : (
        <div className="course-list">
          {courses.map((course) => {
            const courseData = course?.course;
            if (!courseData) return null; // Skip if course data is missing

            return (
              <div 
                key={courseData._id} 
                className="course-card"
                onClick={() => navigate(`/course/${courseData._id}`)}
              >
                <img 
                  src={courseData?.imageUrl || "/default-image.jpg"} 
                  alt={courseData?.title || "Course Image"} 
                  className="course-img" 
                />
                <div className="course-info">
                  <h3>{courseData?.title || "Untitled Course"}</h3>
                  <p>{courseData?.description || "No description available."}</p>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${course?.progress || 0}%` }}></div>
                  </div>
                  <p className="progress-text">📈 Progress: {course?.progress || 0}%</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
//