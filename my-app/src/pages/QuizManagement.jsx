import React, { useState, useEffect } from 'react';

const BASE_URL = "http://localhost:5000";

const styles = {
  container: {
    maxWidth: 800,
    margin: "30px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
    background: "#f9f9f9",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  error: {
    color: "#d93025",
    marginBottom: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  quizList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
    gap: 15,
    marginBottom: 30,
  },
  quizCard: {
    background: "#fff",
    borderRadius: 6,
    padding: 15,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#222",
  },
  quizInfo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.25s ease",
  },
  editBtn: {
    backgroundColor: "#1a73e8",
    color: "white",
  },
  editBtnHover: {
    backgroundColor: "#1669c1",
  },
  deleteBtn: {
    backgroundColor: "#d93025",
    color: "white",
  },
  deleteBtnHover: {
    backgroundColor: "#b2221a",
  },
  form: {
    background: "#fff",
    padding: 20,
    borderRadius: 6,
    boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: "600",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
    boxSizing: "border-box",
    transition: "border-color 0.25s ease",
  },
  inputFocus: {
    borderColor: "#1a73e8",
    outline: "none",
  },
  questionGroup: {
    display: "flex",
    gap: 8,
    marginBottom: 10,
  },
  questionInput: {
    flexGrow: 1,
    padding: "10px 12px",
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  removeBtn: {
    backgroundColor: "#d93025",
    color: "white",
    border: "none",
    borderRadius: 5,
    padding: "0 12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 1,
  },
  addQuestionBtn: {
    backgroundColor: "#1a73e8",
    color: "white",
    fontWeight: "700",
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    marginBottom: 15,
    transition: "background-color 0.25s ease",
  },
  addQuestionBtnHover: {
    backgroundColor: "#1669c1",
  },
  submitBtn: {
    backgroundColor: "#1a73e8",
    color: "white",
    fontWeight: "700",
    padding: "12px 20px",
    width: "100%",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    transition: "background-color 0.25s ease",
  },
  submitBtnHover: {
    backgroundColor: "#1669c1",
  },
};

function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);

  const load = () => {
    fetch(`${BASE_URL}/quizzes`)
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(data => {
        setQuizzes(data);
        setError(null);
      })
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  
 

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    fetch(`${BASE_URL}/quizzes/${id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        await load();
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Quiz Management</h2>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.quizList}>
        {quizzes.map(q => (
          <div key={q._id} style={styles.quizCard}>
            <div>
              <div style={styles.quizTitle}>{q.title}</div>
              <div style={styles.quizInfo}>Level: {q.level || "N/A"}</div>
              <div style={styles.quizInfo}>Questions: {q.questions.length}</div>
              <div>{q.description}</div>
            </div>
            <div style={styles.buttonGroup}>
              
              <button
                style={{ ...styles.button, ...styles.deleteBtn }}
                onClick={() => handleDelete(q._id)}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = styles.deleteBtnHover.backgroundColor)}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = styles.deleteBtn.backgroundColor)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      
          
        </div>

        
      </div>
    
  );
}

export default QuizManagement;
