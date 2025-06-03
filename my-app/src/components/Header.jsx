import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import logo from '../1.png';

const Header = () => {
  const { loggedIn, role, logout } = useAuth(); // make sure user is from your AuthContext
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfileDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              {role === 'student' && (
                <li style={navItemStyle}>
                  <Link to="/practice" style={linkStyle}>Practice</Link>
                </li>
              )}
              {role === 'instructor' && (
                <li style={navItemStyle}>
                  <Link to="/upload-courses" style={linkStyle}>Upload Courses</Link>
                </li>
              )}
              {(role === 'student' || role === 'instructor' || role === 'admin') && (
                <li style={navItemStyle}>
                  <Link to="/enrolled-courses" style={linkStyle}>Enrolled Courses</Link>
                </li>
              )}
              {role === 'admin' && (
                <>
                  <li style={navItemStyle}>
                    <Link to="/course-management" style={linkStyle}>Course management</Link>
                  </li>
                  <li style={navItemStyle}>
                    <Link to="/quiz-management" style={linkStyle}>Quiz management</Link>
                  </li>
                  <li style={navItemStyle}>
                    <Link to="/user-management" style={linkStyle}>User management</Link>
                  </li>
                </>
              )}
              

              {/* Profile icon + dropdown */}
              <li
                style={{ ...navItemStyle, position: 'relative', cursor: 'pointer' }}
                ref={dropdownRef}
              >
                <div
                  onClick={() => setShowProfileDropdown((prev) => !prev)}
                  style={{ padding: '5px' }}
                  title="Profile"
                >
                  {/* Profile icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="30"
                    viewBox="0 0 24 24"
                    width="30"
                    fill="white"
                  >
                    <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.9 1.7-9.9 4.9v2.6h19.8v-2.6c0-3.2-6.6-4.9-9.9-4.9z" />
                  </svg>
                </div>

                {showProfileDropdown && (
                  <div style={dropdownStyle}>
                   
                    <hr style={{ margin: '10px 0' }} />
                    <Link
                      to="/profile"
                      style={dropdownLinkStyle}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      View Profile
                    </Link>
                    <div
                      onClick={() => {
                        handleLogout();
                        setShowProfileDropdown(false);
                      }}
                      style={{ ...dropdownLinkStyle, cursor: 'pointer' }}
                    >
                      Logout
                    </div>
                  </div>
                )}
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
  alignItems: 'center',
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

const dropdownStyle = {
  position: 'absolute',
  top: '40px',
  right: 0,
  width: '200px',
  backgroundColor: 'white',
  color: '#333',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  borderRadius: '6px',
  padding: '15px',
  zIndex: 1500,
};


const dropdownLinkStyle = {
  display: 'block',
  padding: '8px 0',
  color: '#007BFF',
  textDecoration: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
  textAlign: 'center',
};

export default Header;
