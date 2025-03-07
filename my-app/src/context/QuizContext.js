// QuizContext.js

import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const useQuiz = () => {
  return useContext(QuizContext);
};

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);

  const addQuiz = (quiz) => {
    setQuizzes((prevQuizzes) => [...prevQuizzes, quiz]);
  };

  const deleteQuiz = (quizId) => {
    setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== quizId));
  };

  const editQuiz = (quizId, updatedQuiz) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz) =>
        quiz.id === quizId ? { ...quiz, ...updatedQuiz } : quiz
      )
    );
  };

  return (
    <QuizContext.Provider value={{ quizzes, addQuiz, deleteQuiz, editQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};
