import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please log in to view your bookings.");
      return;
    }

    // Fetch the bookings based on userId
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/payments/${user._id}`);
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        alert("Error fetching bookings. Please try again.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container">
          <p>Loading bookings...</p>
        </div>
        <Footer />
      </div>
    );
  }


  const handleCancelBooking = async (orderId) => {
    try {
      const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
      if (!confirmCancel) return;
  
      const response = await axios.put(`http://localhost:5000/api/payments/${orderId}`, {
        status: "Canceled",
      });
      alert(response.data.message);
  
      // Refresh the bookings
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.orderId === orderId ? { ...booking, visitingStatus: "Canceled" } : booking
        )
      );
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel the booking. Please try again.");
    }
  };
  




  return (
    <div>
      <Header />
      <div className="booking-section-one">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1>Bookings Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-section-two">
        <div className="container">
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <div key={index} className="row">
                <div className="col-md-12">
                  <div className="card mt-4">
                    <div className="card-header">
                      <div className="booking-sec-two-top">
                        <div>
                          <h5>Order ID: {booking.orderId}</h5>
                          <p><strong>Visiting On :</strong> {booking.datetime.map((dateTime, index) => (
                        <span key={index}>{dateTime.date} at {dateTime.time} </span>
                      ))}</p>
                        </div>
                        <div>
                          <h5>Visiting Status</h5>
                          <p 
                          style={{
                            color: 
                            booking.visitingStatus === "Completed" ? "green" :
                            booking.visitingStatus === "In Process" ? "orange" : "",
                            fontWeight: 
                            booking.visitingStatus === "Completed" ? "500" :
                            booking.visitingStatus === "In Process" ? "500": "",
                          }}
                          >
                            {booking.visitingStatus}
                          </p>
                        </div>
                        <div>
                          <a href="#" className="">invoice</a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">

                      <div className="row">
                        <div className="col-md-4">
                          <h5>Customer Address</h5>
                          <p>{booking.address[0]?.fname}</p>
                          <p>{booking.address[0]?.house}</p>
                          <p>{booking.address[0]?.town}, {booking.address[0]?.country}, {booking.address[0]?.pincode}</p>
                        </div>
                        <div className="col-md-4">
                          <h5>Payment Status</h5>
                          <p>{booking.paymentStatus}</p>
                          
                          <h5>Payment Method</h5>
                          <p>{booking.paymentMethod}</p>
                        </div>

                        <div className="col-md-4">
                        <h5>Order Summary</h5>
                        <div className="order-summary-details-box">
                          <p>
                            Subtotal
                          </p>
                          <p>
                            ${booking.cartItems.reduce(
                            (subtotal, item) => subtotal + item.quantity * item.price, 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="order-summary-details-box">
                          <p>
                            Taxes & Fees
                          </p>
                          <p>
                            ${booking.taxesAndFee}
                          </p>
                        </div>
                        <div className="order-summary-details-box">
                          <p>
                            Visitation Fee
                          </p>
                          <p>
                            ${booking.visitationFee}
                          </p>
                        </div>
                        <div className="order-summary-details-box">
                          <h5>
                            Total Amount
                          </h5>
                          <h5>
                            ${booking.totalAmount}
                          </h5>
                        </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="row">
                        <div className="col-md-8">
                          <div className="order-summary-cart-item">

                          <ul>
          {booking.cartItems.map((item) => (
            <li key={item._id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <div className="booking-detail-img">
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.productName} />
                </div>
                <div className="booking-detail-info" style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>{item.productName}</p>
                <p style={{ margin: 0 }}>Quantity: {item.quantity}</p>
                <p style={{ margin: 0 }}>${(item.price).toFixed(2)}</p>
              </div>
              
            </li>
          ))}
        </ul>

                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="btn-booking-cancel-group">
                          {/* <button
  className="btn btn-booking-cancel"
  onClick={() => handleCancelBooking(booking.orderId)}
  disabled={booking.visitingStatus === "Canceled" || booking.visitingStatus === "In Process"}
>
  {booking.visitingStatus === "Canceled" ? "Canceled" : "Booking Cancel"}
</button> */}

<button
  className="btn btn-booking-cancel"
  onClick={() => handleCancelBooking(booking.orderId)}
  disabled={booking.visitingStatus === "Canceled" || booking.visitingStatus === "In Process" || booking.visitingStatus === "Completed"}
  style={{
    backgroundColor: 
    booking.visitingStatus === "In Process" ? "orange" :
    booking.visitingStatus === "Completed" ? "green" : "",
    color: 
    booking.visitingStatus === "In Process" ? "white" : 
    booking.visitingStatus === "Completed" ? "white" : "",
  }}
>
  {booking.visitingStatus === "Canceled"
    ? "Canceled"
    : booking.visitingStatus === "In Process"
    ? "In Process"
    : booking.visitingStatus === "Completed"
    ? "Completed"
    : "Booking Cancel"
    }
</button>


                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No bookings found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyBookings;
