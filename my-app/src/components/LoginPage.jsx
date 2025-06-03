import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import "./login.css";
import swal from 'sweetalert';
const LoginPage = () => {
  const [role, setRole] = useState("student"); // Default role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get("redirectTo") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
        role, // Send role in the request
      });

      const { token, user } = response.data;

      login(user.role, { email: user.email, username: user.username, token });

      // Redirect based on role
      if (user.role === "student") navigate(redirectTo || "/");
      else if (user.role === "instructor") navigate("/");
      else if (user.role === "admin") navigate("/");
      else navigate("/");

    } catch (error) {
      swal(error.response?.data?.message || "Login failed! Please try again.");
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
              checked={role === "student"}
              onChange={() => setRole("student")}
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="instructor"
              checked={role === "instructor"}
              onChange={() => setRole("instructor")}
            />
            Instructor
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />
            Admin
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
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default LoginPage;
