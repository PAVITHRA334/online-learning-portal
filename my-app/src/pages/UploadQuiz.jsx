import { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadQuiz.css';
import swal from 'sweetalert';
const UploadQuiz = () => {
  const [quizId, setQuizId] = useState(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
  const [quizzes, setQuizzes] = useState([]); 
  useEffect(() => {
    const loadQuizzes = async () => {
      await fetchQuizzes();
    };
    loadQuizzes();
  }, []);
  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/quizzes"); 
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };
  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
  };
  const handleAnswerChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answer = e.target.value;
    setQuestions(updatedQuestions);
  };
  const handleOptionChange = (e, index, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };
  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };
  const deleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = {
      name: quizTitle,
      title: quizTitle,
      description: quizDescription,
      level: "Custom",
      questions: questions.map(q => ({
        question: q.question,
        options: q.options,
        answer: q.answer, 
        correctAnswer: q.answer,  
      })),
    
    };
    console.log('Quiz Data before submission:', quizData);
    try {
      let response;
      if (quizId) {
        console.log(`Updating quiz with ID: ${quizId}`);
        response = await axios.put(
          `http://localhost:5000/quizzes/${quizId}`,
          quizData,
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        console.log('Uploading a new quiz');
        response = await axios.post(
          'http://localhost:5000/quizzes',
          quizData,
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
      console.log('Response from server:', response.data);
      swal(`Quiz "${quizTitle}" has been ${quizId ? 'updated' : 'uploaded'}!`);
      setQuizId(null);
      setQuizTitle('');
      setQuizDescription('');
      setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
      fetchQuizzes();
    } catch (error) {
      console.error('Error saving quiz:', error.response ? error.response.data : error.message);
     swal(error.response?.data?.message || 'Error saving quiz. Check the console for details.');
    }
  };
  const editQuiz = (quiz) => {
    setQuizId(quiz._id);
    setQuizTitle(quiz.title);
    setQuizDescription(quiz.description);
    setQuestions(quiz.questions);
  };
  const deleteQuiz = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await axios.delete(`http://localhost:5000/quizzes/${id}`);
      swal('Quiz deleted successfully!');
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      swal('Error deleting quiz.');
    }
  };

  return (
    <div className="upload-quiz-container">
      <h2>{quizId ? 'Edit Quiz' : 'Upload New Quiz'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quiz Title:</label>
          <input type="text" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Quiz Description:</label>
          <input type="text" value={quizDescription} onChange={(e) => setQuizDescription(e.target.value)} required />
        </div>

        <h3>Questions & Answers</h3>
        {questions.map((question, index) => (
          <div key={index} className="question-section">
            <input
              type="text"
              value={question.question}
              onChange={(e) => handleQuestionChange(e, index)}
              placeholder={`Question ${index + 1}`}
              required
            />
            <div className="options-group">
              {question.options.map((option, optionIndex) => (
                <input
                  key={optionIndex}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(e, index, optionIndex)}
                  placeholder={`Option ${optionIndex + 1}`}
                  required
                />
              ))}
            </div>
            <input
              type="text"
              value={question.answer}
              onChange={(e) => handleAnswerChange(e, index)}
              placeholder="Correct Answer"
              required
            />
            <button type="button" onClick={() => deleteQuestion(index)}>
              Delete Question
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>
          Add Question
        </button>

        <button type="submit">{quizId ? 'Update Quiz' : 'Upload Quiz'}</button>
      </form>

      <h2>Uploaded Quizzes</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>
            <div>
              <strong>{quiz.title}</strong>
              <p>{quiz.description}</p>
            </div>
            <div>
              <button onClick={() => editQuiz(quiz)}>Edit</button>
              <button onClick={() => deleteQuiz(quiz._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadQuiz;
