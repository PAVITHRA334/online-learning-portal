import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { userDetails, role } = useAuth();

  const [currentStrikes, setCurrentStrikes] = useState(0);
  const [xpPoints, setXpPoints] = useState(0);
  const [learningStreak, setLearningStreak] = useState(0);
  const [quote, setQuote] = useState('');
  const [uploadedCourses, setUploadedCourses] = useState([]);
  const [uploadedQuizzes, setUploadedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userDetails) {
      const savedDate = localStorage.getItem('lastStrikeResetDate');
      const today = new Date().toISOString().split('T')[0];

      if (savedDate !== today) {
        localStorage.setItem('lastStrikeResetDate', today);
        setCurrentStrikes(0);
        setLearningStreak((prev) => prev + 1);
      } else {
        setCurrentStrikes(userDetails.strikes || 0);
      }

      setXpPoints(userDetails.xp || 0);

      const motivationalQuotes = [
        "Believe in yourself and all that you are!",
        "Every expert was once a beginner.",
        "Success is the sum of small efforts, repeated daily.",
        "Learning never exhausts the mind.",
        "Your only limit is your mind."
      ];
      setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }
  }, [userDetails]);

  const fetchInstructorData = useCallback(async () => {
    if (!userDetails?._id) return;

    try {
      setLoading(true);
      const [coursesRes, quizzesRes] = await Promise.all([
        axios.get(`/api/instructor/courses/${userDetails._id}`),
        axios.get(`/api/instructor/quizzes/${userDetails._id}`)
      ]);

      setUploadedCourses(coursesRes.data || []);
      setUploadedQuizzes(quizzesRes.data || []);
    } catch (error) {
      console.error('Error fetching instructor data:', error);
    } finally {
      setLoading(false);
    }
  }, [userDetails]);

  useEffect(() => {
    if (role === 'instructor' && userDetails?._id) {
      fetchInstructorData();
    }
  }, [fetchInstructorData, role, userDetails?._id]);

  const pieChartData = [
    { name: 'Courses', value: uploadedCourses.length },
    { name: 'Quizzes', value: uploadedQuizzes.length },
  ];

  const COLORS = ['#0088FE', '#FFBB28'];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {userDetails?.name || 'User'}!</h1>

      <div className="dashboard-content">
        <div className="dashboard-box">
          <h3>Strikes</h3>
          <p>{currentStrikes} {currentStrikes !== 1 ? 'strikes' : 'strike'} today</p>
        </div>

        <div className="dashboard-box">
          <h3>XP Points</h3>
          <p>{xpPoints} XP earned</p>
        </div>

        <div className="dashboard-box">
          <h3>Learning Streak</h3>
          <p>{learningStreak} days streak 🔥</p>
        </div>

        <div className="dashboard-box">
          <h3>Motivational Quote</h3>
          <p>"{quote}"</p>
        </div>

        {role === 'instructor' && (
          <div className="dashboard-box">
            <h3>Uploaded Courses & Quizzes</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <PieChart width={300} height={300}>
                <Pie
                  data={pieChartData}
                  cx={150}
                  cy={150}
                  innerRadius={50}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
