import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import logo from '../1.png'; 

const Header = () => {
  const { loggedIn, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={headerStyle}>
      <div style={logoContainer}>
        <img src={logo} alt="Logo" style={logoStyle} />
      </div>
      <nav>
        <ul style={navListStyle}>
          {loggedIn ? (
            <>
              <li style={navItemStyle}>
                <Link to="/" style={linkStyle}>Home</Link>
              </li>
              {role === 'instructor' && (
                <li style={navItemStyle}>
                  <Link to="/upload-quiz" style={linkStyle}>Upload Quiz</Link>
                </li>
              )}
              {role==='student'&&(
              <li style={navItemStyle}>
                <Link to="/practice" style={linkStyle}>Practice</Link>
              </li>)}
              {role === 'instructor' && (
                <li style={navItemStyle}>
                  <Link to="/upload-courses" style={linkStyle}>Upload Courses</Link>
                </li>
              )}
               {role === 'student' && (
                <li style={navItemStyle}>
                  <Link to="/enrolled-courses" style={linkStyle}>Enrolled Courses</Link>
                </li>
              )}
              <li style={navItemStyle}>
                <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
              </li>
              <li>
                <Link to="/" style={linkStyle} onClick={handleLogout}>Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li style={navItemStyle}>
                <Link to="/" style={linkStyle}>Home</Link>
              </li>
              <li>
                <Link to="/login" style={linkStyle}>Login/Signup</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

const headerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '99%',
  padding: '4px 10px',
  backgroundColor: '#007BFF',
  color: 'white',
  zIndex: 1000, 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', 
};

const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', 
  width: '40px',
  height: '50px',
  backgroundColor: 'transparent',
};

const logoStyle = {
  width: '60px',
  height: '60px',
  objectFit: 'contain',
};

const navListStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  listStyleType: 'none',
  margin: 0,
  padding: 0,
};

const navItemStyle = {
  marginRight: '20px',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 'bold',
  padding: '10px 20px',
};

export default Header;
