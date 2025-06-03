import React from "react";
import swal from 'sweetalert';
const Footer = () => {
  const footerStyle = {
    backgroundColor: "#007BFF",
    color: "white",
    textAlign: "center",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: "50px",
  };

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: "1200px",
  };

  const sectionStyle = {
    flex: "1",
    minWidth: "250px",
    margin: "10px",
  };

  const headingStyle = {
    color: "white",
    fontSize: "20px",
    marginBottom: "10px",
  };

  const linkStyle = {
    color: "#FFD700", // Gold/yellow for better contrast
    textDecoration: "underline",
  };

  const socialIconsStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    fontSize: "24px",
  };

  const helpButtonStyle = {
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "20px",
  };

  const footerBottomStyle = {
    marginTop: "25px",
    borderTop: "1px solid rgba(255,255,255,0.2)",
    paddingTop: "15px",
    width: "100%",
    maxWidth: "1200px",
    textAlign: "center",
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h3 style={headingStyle}>About Us</h3>
          <p>We provide quality courses and quizzes to enhance learning.</p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Contact Us</h3>
          <p>Email: <a href="mailto:support@yourwebsite.com" style={linkStyle}>support@yourwebsite.com</a></p>
          <p>Phone: +123 456 7890</p>
          <p>Address: 123 Learning Street, Education City</p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Follow Us</h3>
          <div style={socialIconsStyle}>
           <button style={linkStyle} onClick={() => swal("Facebook link coming soon!")}>📘</button>
<button style={linkStyle} onClick={() => swal("Instagram link coming soon!")}>📷</button>
<button style={linkStyle} onClick={() => swal("Twitter link coming soon!")}>🐦</button>
<button style={linkStyle} onClick={() => swal("LinkedIn link coming soon!")}>🔗</button>
<button style={linkStyle} onClick={() => swal("YouTube link coming soon!")}>▶️</button>

          </div>
        </div>
      </div>

      <div style={footerBottomStyle}>
        <button style={helpButtonStyle} onClick={() => swal("Chatbot Coming Soon!")}>
          💬 Help
        </button>
        <p style={{ marginTop: "10px" }}>&copy; {new Date().getFullYear()} Your Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
