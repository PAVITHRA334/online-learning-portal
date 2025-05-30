import React, { useState, useEffect } from 'react';

const BASE_URL = "http://localhost:5000";

const styles = {
  container: {
    maxWidth: 800,
    margin: "30px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
    background: "#f4f6f8",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  courseList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    gap: 20,
  },
  courseCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 10,
    color: "#222",
  },
  coursePrice: {
    color: "#1a73e8",
    fontWeight: 700,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 15,
    color: "#555",
  },
  deleteButton: {
    backgroundColor: "#d93025",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "600",
    transition: "background 0.25s ease",
  },
  deleteButtonHover: {
    backgroundColor: "#b2221a",
  },
  error: {
    color: "#d93025",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
};

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  const loadCourses = () => {
    fetch(`${BASE_URL}/courses`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    fetch(`${BASE_URL}/courses/${id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        loadCourses();
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Course Management</h2>
      {error && <p style={styles.error}>Error: {error}</p>}

      <div style={styles.courseList}>
        {courses.map((c) => (
          <div key={c._id} style={styles.courseCard}>
            <div>
              <div style={styles.courseTitle}>{c.title}</div>
              <div style={styles.coursePrice}>${(+c.price).toFixed(2)}</div>
              <div style={styles.description}>{c.description}</div>
            </div>
            <button
              style={styles.deleteButton}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.deleteButtonHover.backgroundColor)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.deleteButton.backgroundColor)}
              onClick={() => handleDelete(c._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseManagement;
