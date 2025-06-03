import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const predefinedQuizzes = [
  {
    id: 1,
    name: "JavaScript Basics",
    description: "Test your knowledge of JavaScript fundamentals.",
    level: "Beginner",
    questions: [
      {
        question: "Which keyword is used to declare a variable in JavaScript?",
        options: ["var", "let", "const", "all of the above"],
        correctAnswer: "all of the above",
      },
      {
        question: "What does `typeof null` return?",
        options: ["null", "object", "undefined", "number"],
        correctAnswer: "object",
      },
    ],
  },
  {
    id: 2,
    name: "Python Fundamentals",
    description: "A quiz on Python basics.",
    level: "Beginner",
    questions: [
      {
        question: "Which of the following is used for comments in Python?",
        options: ["//", "#", "/* */", "--"],
        correctAnswer: "#",
      },
      {
        question: "What is the output of `print(type([]))`?",
        options: ["list", "tuple", "<class 'list'>", "dictionary"],
        correctAnswer: "<class 'list'>",
      },
    ],
  },
  {
    id: 3,
    name: "Java OOP",
    description: "Test your understanding of Object-Oriented Programming in Java.",
    level: "Intermediate",
    questions: [
      {
        question: "Which concept of OOP allows the use of the same method name with different implementations?",
        options: ["Encapsulation", "Polymorphism", "Inheritance", "Abstraction"],
        correctAnswer: "Polymorphism",
      },
      {
        question: "Which keyword is used to inherit a class in Java?",
        options: ["this", "extends", "super", "implements"],
        correctAnswer: "extends",
      },
    ],
  },
];

const Practice = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/quizzes");
        setQuizzes([...predefinedQuizzes, ...response.data]);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setQuizzes(predefinedQuizzes);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Practice Quizzes</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {quizzes.map((quiz) => (
          <div
            key={quiz.id || quiz._id}
            style={{
              border: "1px solid gray",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9f9f9",
              textAlign: "center",
            }}
          >
            <h3>{quiz.name || quiz.title}</h3>
            <p>{quiz.description}</p>
            <p>
              <strong>Level:</strong> {quiz.level || "Custom"}
            </p>
            <button
              onClick={() => navigate(`/quiz/${quiz.id || quiz._id}`, { state: { quiz } })}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Practice;
