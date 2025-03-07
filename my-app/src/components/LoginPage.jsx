import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  
import { useAuth } from './AuthContext'; 
import './login.css';
const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get('redirectTo') || '/';  
  const authenticate = (username, password) => {
    return username === 'user' && password === 'p'; 
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isAuthenticated = authenticate(username, password);
    if (isAuthenticated) {
      const userDetails = {  email,  username };
      login(role, userDetails); 
      if (role === 'student') {
        navigate(redirectTo || '/explore-courses');
      } else if (role === 'instructor') {
        navigate('/'); 
      }
    } else {
      alert('Invalid credentials!');
    }
  };
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === 'student'}
              onChange={() => setRole('student')}
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="instructor"
              checked={role === 'instructor'}
              onChange={() => setRole('instructor')}
            />
            Instructor
          </label>
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
