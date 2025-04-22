import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";

const LoginPage = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Function to send OTP
  const sendOtp = async () => {
    try {
      const mobiles = [mobile]; // Array with a single mobile number
      const response = await axios.post("http://localhost:5000/api/send-otp", { mobiles });
      console.log(response.data.message); // OTP sent successfully message
      setOtpSent(true); // OTP sent, show OTP input
    } catch (error) {
      console.error("Failed to send OTP:", error.response?.data?.error || error.message);
    }
  };
  

  // Function to verify OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", { mobile, otp });
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Save user data to localStorage
      window.location.href = "/cart"; // Redirect to the cart page
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
        <Header/>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="card mt-4">
              <div className="card-body">
                {!otpSent ? (
                  <div>
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Mobile Number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                    <button className="btn btn-primary m-auto d-block" onClick={sendOtp}>
                      Send OTP
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button className="btn btn-primary m-auto d-block" onClick={verifyOtp}>
                      Verify OTP
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
