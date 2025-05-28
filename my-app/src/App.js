import { AuthProvider } from './components/AuthContext';
import { QuizProvider } from './context/QuizContext'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from "./components/SignupPage";
import Home from './pages/Home';
import Header from './components/Header';
import UploadCourses from './pages/UploadCourses';
import EnrolledCourses from './components/EnrolledCourses';
import CourseDetails from './components/CourseDetails';
import Dashboard from './pages/Dashboard'; 
import Practice from './pages/Practice';
import UploadQuiz from './pages/UploadQuiz';
import TakeQuiz from './pages/TakeQuiz';
import { CourseProvider } from './context/CourseContext';
import Footer from './components/Footer'; 
import './App.css';

function App() {
  return (
    <AuthProvider>
      <QuizProvider> 
      <CourseProvider>
        <Router>
          <div className="App" style={{ paddingTop: '70px' }}> 
            <Header />
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/upload-courses" element={<UploadCourses />} />
                  <Route path="/enrolled-courses" element={<EnrolledCourses />} />
                  <Route path="/course-details/:courseId" element={<CourseDetails />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/practice" element={<Practice />} />
                  <Route path="/upload-quiz" element={<UploadQuiz />} />
                  <Route path="/quiz/:id" element={<TakeQuiz />} />
                </Routes>
              </div>
            </div>
            <Footer /> 
          </div>
        </Router>
        </CourseProvider>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
