import React, { useState } from "react";
import axios from "axios";

const AdminRegister = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    contact_number: "",
    role: "admin", // Default role
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", userData);
      alert(response.data.message);
      window.location.href = "/adminlogin"; // Redirect to login page
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div>
      <div className="section-admin-login">
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="form-card">
                <h2>Admin Register</h2>
                <form method="POST" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Full Name"
                      value={userData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email Address"
                      value={userData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="contact_number"
                      className="form-control"
                      placeholder="Contact Number"
                      value={userData.contact_number}
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
                      value={userData.password}
                      onChange={handleChange}
                      required
                    />
                  </div> 
                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary">
                      Register
                    </button>
                  </div>
                </form>
                <div className="create-account-box">
                  <a href="/adminlogin" className="btn-create-account">
                    Already have an account?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
