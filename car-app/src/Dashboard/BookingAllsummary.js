import React, { useState, useEffect } from "react";
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import AdminHeader from './AdminHeader'
import AdminFooter from './AdminFooter'
import { useNavigate } from "react-router-dom";

const BookingAllsummary = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/all-booking-summaries");
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);


   if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;



  // Delete Booking Function

  // const deleteBooking = async (bookingId) => {
  //   const confirmDelete = window.confirm("Are you sure you want to delete this Booking?");
  //   if (!confirmDelete) return;
  
  //   try {
  //     console.log("Sending delete request for ID:", bookingId);
  //     await axios.delete(`http://localhost:5000/api/all-booking-summaries/${bookingId}`);
  //     toast.success("Booking deleted successfully.");
  //     setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
  //   } catch (error) {
  //     console.error("Error deleting Booking:", error.response?.data || error.message);
  //     toast.error("Failed to delete Booking.");
  //   }
  // };

  const viewBooking = (bookingId) => {
    console.log(`Viewing booking with id: ${bookingId}`);
    navigate(`/bookingSummarydetails/${bookingId}`); // Navigate to the booking details page
  };


  // const handlePrint = () => {
  //   navigate("/print"); // Redirect to Print Page
  // };


  




  return (
    <div>

      <div className="main-content">
        <div className="container-fluid">
          <AdminHeader />

          <div className="row">
            <div className="col-md-12">
                    <div className="breadcrumb-wrap mb-g bg-red-gradient">
                        <div className="row">
                            <div className="col-md-12">
                              <div className="dashboard-title">
                                <h2>Booking Summary</h2>
                              </div>
                            </div>
                        </div>
                    </div>
                    <ToastContainer /> 
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-wrap">

              <div className="table-responsive">
        <table className="table table-bordered">
          
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Total Amount</th>
            <th>Payment Status</th>
            <th>Service Partner</th>
            <th>Visiting Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.orderId}>
              <td>{booking.orderId}</td>
              <td>{booking.userId}</td>
              <td>{booking.totalAmount}</td>
              <td>{booking.paymentStatus}</td>
              <td>
                {booking.servicePartners?.map((partner) => partner.name).join(", ")}
              </td>
              <td>{booking.visitingStatus}</td>
              <td>
                  <div className="d-flex" style={{gap:"10px"}}>
                  {/* <button className="btn btn-info" onClick={() => viewBooking(booking)}>View</button> */}
                  <button className="btn btn-info" onClick={() => viewBooking(booking._id)}> View</button>
                  {/* <button className="btn btn-danger" onClick={() => deleteBooking(booking._id)}>Delete</button>
                  <button className="btn btn-warning" onClick={() => openPrintWindow(booking)}>Print</button> */}
                  </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          
      </div>

              </div>
            </div>
          </div>



        </div>
      </div>

      <AdminFooter/>

    </div>
  )
}

export default BookingAllsummary