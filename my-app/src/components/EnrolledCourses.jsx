import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

const styles = {
  container: {
    maxWidth: 1000,
    margin: "30px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
    background: "#f9f9f9",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  courseList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
    gap: 15,
  },
  courseCard: {
    background: "#fff",
    borderRadius: 6,
    padding: 15,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#222",
  },
  lessonList: {
    marginTop: 10,
    paddingLeft: 18,
  },
  lessonItem: {
    marginBottom: 6,
    color: "#1a73e8",
    cursor: "pointer",
    textDecoration: "underline",
  },
  error: {
    color: "#d93025",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyMessage: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#666",
  },
};

const EnrolledCourses = () => {
  const { loggedIn } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEnrolledCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");

      const response = await axios.get("http://localhost:5000/api/enrolled-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      fetchEnrolledCourses();
    }
  }, [loggedIn, navigate]);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Your Enrolled Courses</h2>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p style={styles.emptyMessage}>Loading courses...</p>}

      {!loading && courses.length === 0 && !error && (
        <p style={styles.emptyMessage}>You have not enrolled in any courses yet.</p>
      )}

      <div style={styles.courseList}>
        {courses.map(({ courseId }) =>
          courseId ? (
            <div
              key={courseId._id}
              style={styles.courseCard}
              onClick={() => toggleExpand(courseId._id)}
            >
              <div style={styles.courseTitle}>{courseId.title}</div>
              {expandedId === courseId._id && Array.isArray(courseId.lessons) && (
                <ul style={styles.lessonList}>
                  {courseId.lessons.map((lesson) => (
                    <li
                      key={lesson._id}
                      style={styles.lessonItem}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course/${courseId._id}/lesson/${lesson._id}`);
                      }}
                    >
                      {lesson.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;
