import React, { useState } from "react";
import axios from "axios";

const ServicePartners = () => {

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        contact_number: "",
        service_name: "",
        address: "",
        area: "",
        city: "",
        pincode: "",
      });
    
      const [isFormTwoVisible, setIsFormTwoVisible] = useState(false); // State to toggle forms
    
      const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormTwoVisible) {
          // Proceed to the next form
          setIsFormTwoVisible(true);
        } else {
          // Submit the complete form
          try {
            const response = await axios.post("http://localhost:5000/servicepartner", userData);
            alert(response.data.message);
            window.location.href = "/thankyou"; // Redirect to login page
          } catch (err) {
            alert(err.response?.data?.message || "Registration failed!");
          }
        }
      };


  return (
    <div>

<div className="section-admin-login">
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="form-card">
                <h2>Service Partners</h2>
                <form method="POST" onSubmit={handleSubmit}>
                  {!isFormTwoVisible && (
                    <div className="form-one">
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
                        <button type="submit" className="btn btn-primary btn-admin-login">
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {isFormTwoVisible && (
                    <div className="form-two">
                      <div className="mb-3">
                        <input
                          type="text"
                          name="service_name"
                          className="form-control"
                          placeholder="Service Name"
                          value={userData.service_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="address"
                          className="form-control"
                          placeholder="Address"
                          value={userData.address}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="area"
                          className="form-control"
                          placeholder="Area"
                          value={userData.area}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="city"
                          className="form-control"
                          placeholder="City"
                          value={userData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="pincode"
                          className="form-control"
                          placeholder="Pincode"
                          value={userData.pincode}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <button type="submit" className="btn btn-primary btn-admin-login">
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default ServicePartners