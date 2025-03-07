import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TakeQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quiz = location.state?.quiz;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState({}); // Track answered questions

  if (!quiz) {
    return <h2 style={{ textAlign: 'center', color: 'red' }}>❌ Quiz not found!</h2>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    // Mark the question as answered
    setAnsweredQuestions((prev) => ({
      ...prev,
      [currentQuestionIndex]: true,
    }));

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div style={{
      display: 'flex',
      maxWidth: '1200px',
      margin: '50px auto',
      padding: '20px',
      background: 'linear-gradient(135deg, #f9f9f9, #e3f2fd)',
      borderRadius: '15px',
      boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
    }}>
      <div style={{
        flex: 3,
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}>
        {!quizFinished ? (
          <>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#333' }}>📝 {quiz.name}</h2>
            <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#555' }}>
              🔢 Question {currentQuestionIndex + 1} / {quiz.questions.length}
            </h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#222', marginBottom: '20px' }}>
              ❓ {currentQuestion.question}
            </p>

            <div>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(option)}
                  style={{
                    display: 'block',
                    margin: '5px auto',
                    padding: '12px',
                    width: '100%',
                    backgroundColor: selectedAnswer === option ? '#007bff' : '#f9f9f9',
                    color: selectedAnswer === option ? 'white' : 'black',
                    border: '2px solid #007bff',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: '0.3s'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                fontSize: '16px',
                borderRadius: '8px',
                transition: '0.3s'
              }}
            >
              {currentQuestionIndex < quiz.questions.length - 1 ? '➡️ Next Question' : '🎉 Finish Quiz'}
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#333' }}>🎯 Quiz Completed!</h2>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#222' }}>
              🎉 Your Score: {score} / {quiz.questions.length}
            </p>
            <button
              onClick={() => navigate('/practice')}
              style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                fontSize: '16px',
                borderRadius: '8px',
                transition: '0.3s'
              }}
            >
              🔙 Back to Quizzes
            </button>
          </>
        )}
      </div>
      <div style={{
        flex: 1,
        padding: '20px',
        maxHeight: '400px',
        overflowY: 'auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        marginLeft: '20px',
        position: 'sticky',
        top: '20px',
      }}>
        <h4 style={{ textAlign: 'center', marginBottom: '15px', color: '#333' }}>📚 Questions</h4>
        <ul style={{ listStyle: 'none', padding: '0', textAlign: 'center' }}>
          {quiz.questions.map((_, index) => {
            let bgColor = '#fff';
            let textColor = '#007bff';
            if (currentQuestionIndex === index) {
              bgColor = '#007bff'; 
              textColor = 'white';
            } else if (answeredQuestions[index]) {
              bgColor = '#28a745'; 
              textColor = 'white';
            }
            return (
              <li key={index} style={{
                display: 'inline-block',
                margin: '5px',
                padding: '10px',
                backgroundColor: bgColor,
                color: textColor,
                borderRadius: '50%',
                border: '2px solid #007bff',
                cursor: 'pointer',
                transition: '0.3s',
                fontWeight: 'bold',
                fontSize: '18px',
                width: '40px',
                height: '40px',
                lineHeight: '40px',
                textAlign: 'center'
              }} onClick={() => setCurrentQuestionIndex(index)}>
                {index + 1}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TakeQuiz;
