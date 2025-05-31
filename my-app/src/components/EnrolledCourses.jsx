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
    gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
    gap: 20,
  },
  courseCard: {
    background: "#fff",
    borderRadius: 6,
    padding: 20,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  courseImage: {
    maxWidth: "100%",
    borderRadius: 6,
    marginBottom: 12,
  },
  courseDescription: {
    color: "#555",
    marginBottom: 12,
  },
  courseDuration: {
    fontStyle: "italic",
    marginBottom: 15,
  },
  lessonList: {
    listStyle: "none",
    paddingLeft: 0,
  },
  lessonItem: {
    marginBottom: 8,
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
  backBtn: {
    cursor: "pointer",
    color: "#1a73e8",
    marginBottom: 10,
    textDecoration: "underline",
  },
  video: {
    width: "100%",
    maxHeight: 400,
    marginTop: 20,
  },
  pdfLink: {
    display: "inline-block",
    marginTop: 10,
    color: "#1a73e8",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

const EnrolledCourses = () => {
  const { loggedIn } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Track the selected course to show details
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Track the selected lesson in course detail view
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      fetchEnrolledCourses();
    }
  }, [loggedIn, navigate]);

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

  // Helper to flatten lessons
  const getLessons = (course) => {
    if (!course) return [];
    if (course.lessons && course.lessons.length > 0) return course.lessons;
    if (course.modules && course.modules.length > 0)
      return course.modules.flatMap((mod) => mod.units || []);
    return [];
  };

  // When no course selected — show list of courses
  if (!selectedCourse) {
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
                onClick={() => setSelectedCourse(courseId)}
              >
                <div style={styles.courseTitle}>{courseId.title}</div>
                {courseId.imageUrl && (
                  <img
                    src={courseId.imageUrl}
                    alt={courseId.title}
                    style={{ ...styles.courseImage, maxHeight: 120, objectFit: "cover" }}
                  />
                )}
                <p style={styles.courseDescription}>
                  {courseId.description.length > 100
                    ? courseId.description.slice(0, 100) + "..."
                    : courseId.description}
                </p>
                <small style={{ color: "#777" }}>
                  Click to view course details and lessons
                </small>
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  }

  // If a course is selected, but no lesson selected — show lessons list
  if (selectedCourse && !selectedLesson) {
    const lessons = getLessons(selectedCourse);
    return (
      <div style={styles.container}>
        <div
          style={styles.backBtn}
          onClick={() => {
            setSelectedCourse(null);
            setSelectedLesson(null);
          }}
        >
          ← Back to courses
        </div>

        <h2 style={styles.header}>{selectedCourse.title}</h2>
        <p style={styles.courseDescription}>{selectedCourse.description}</p>
        <p style={styles.courseDuration}>
        </p>

        <h3>Lessons:</h3>
        {lessons.length === 0 ? (
          <p>No lessons available.</p>
        ) : (
          <ul style={styles.lessonList}>
            {lessons.map((lesson) => (
              <li
                key={lesson._id}
                style={styles.lessonItem}
                onClick={() => setSelectedLesson(lesson)}
              >
                {lesson.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // If a lesson is selected — show video and PDF
  if (selectedLesson) {
    return (
      <div style={styles.container}>
        <div
          style={styles.backBtn}
          onClick={() => setSelectedLesson(null)}
        >
          ← Back to lessons
        </div>

        <h3>{selectedLesson.title}</h3>

        {selectedLesson.videoUrl ? (
          <video
            src={selectedLesson.videoUrl}
            controls
            style={styles.video}
          />
        ) : (
          <p>No video available for this lesson.</p>
        )}

        {selectedLesson.pdfUrl ? (
          <a
            href={selectedLesson.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.pdfLink}
          >
            View PDF
          </a>
        ) : (
          <p>No PDF available for this lesson.</p>
        )}
      </div>
    );
  }

  // fallback (shouldn't happen)
  return null;
};

export default EnrolledCourses;
