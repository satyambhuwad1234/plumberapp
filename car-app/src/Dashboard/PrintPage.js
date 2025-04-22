import React, { useEffect } from "react";

const PrintPage = () => {
  useEffect(() => {
    window.print(); // Automatically print on page load
  }, []);

  return (
    <div style={{ padding: "20px", fontSize: "18px" }}>
      <h2>Booking Summary</h2>
      <p><strong>Name:</strong> John Doe</p>
      <p><strong>Service:</strong> Plumbing</p>
      <p><strong>Booking Date:</strong> 10th Feb 2025</p>
      <p><strong>Amount:</strong> ₹500</p>
    </div>
  );
};

export default PrintPage;
