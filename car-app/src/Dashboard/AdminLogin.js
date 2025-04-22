import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      // Send login request
      const response = await axios.post("http://localhost:5000/login", formData);

      // Alert the message from the server
      alert(response.data.message);

      // Store token and user role in localStorage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userRole", response.data.user.role);

      // Redirect based on user role
      if (response.data.user.role === "super-admin") {
        navigate("/dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      // Handle error response
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      alert(errorMessage);
    }
  };

  return (
    <div>
      <div className="section-admin-login">
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="form-card">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button className="btn btn-primary btn-admin-login" type="submit">
                    Login
                  </button>
                  <div className="create-account-box">
                    <a href="#" className="btn-forgot-password">
                      Forgot password
                    </a>
                    <a href="#" className="btn-create-account">
                      Create your account
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
