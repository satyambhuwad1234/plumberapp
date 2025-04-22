import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyBooking = () => {
  const { orderId } = useParams();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [payments, setPayments] = useState([]); // Declare payments state

  const handleVerify = async (orderId, otp) => {
    try {
      const response = await axios.post("http://localhost:5000/api/verify-booking", { orderId, otp });
  
      if (response.status === 200) {
        toast.success("Booking verified successfully!");
  
        // Fetch updated payments data after successful verification
        const updatedPayments = await axios.get("http://localhost:5000/api/admin/payments");
        setPayments(updatedPayments.data);  // Set the updated payments data
      }
    } catch (error) {
      console.error("Error verifying booking:", error);
      toast.error("Failed to verify booking.");
    }
  };

  return (
    <div>
      <h1>Verify Booking</h1>
      <p>Order ID: {orderId}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={() => handleVerify(orderId, otp)}>Verify</button>
      <p>{message}</p>

      {/* Optional: Show updated payments list */}
      {/* <div>
        <h2>Payments</h2>
        {payments.length > 0 ? (
          <ul>
            {payments.map((payment, index) => (
              <li key={index}>{payment.orderId}: {payment.visitingStatus}</li>
            ))}
          </ul>
        ) : (
          <p>No payments found.</p>
        )}
      </div> */}

      <ToastContainer />
    </div>
  );
};

export default VerifyBooking;
