import React, { useEffect, useState } from 'react';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import { useNavigate } from "react-router-dom";

const AdminPayment = () => {

  const [payments, setPayments] = useState([]);
  const [Loading, setloading] = useState(true);
  const navigate = useNavigate();
  const [processingOrders, setProcessingOrders] = useState({}); // Track which orders are being processed

  useEffect(() => {
    const fetchPayments= async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/payments");
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setloading(false);
      }
    };
    fetchPayments();
  }, []);


  const handleViewDetails = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };


  // const handlePendingClick = async (orderId) => {
  //   try {
  //     // Find the payment details for the clicked order
  //     const bookingData = payments.find(payment => payment.orderId === orderId);
  //     if (!bookingData) {
  //       toast.error("No booking data found for this order.");
  //       return;
  //     }
  
  //     // Call the API to save the booking summary and send OTP
  //     const response = await axios.post("http://localhost:5000/api/save-booking-summary", bookingData);
  
  //     if (response.status === 200) {
  //       toast.success("Booking summary saved successfully and OTP sent.");
  //       navigate("/booking-summary", { state: { bookingDetails: bookingData } });
  //     }
  //   } catch (error) {
  //     console.error("Error saving booking summary:", error); // Log the entire error object
  //     toast.error(`Failed to save booking summary: ${error.message || error}`);
  //   }
  // };



  const handlePendingClick = async (orderId) => {
    try {
      // Find the payment details for the clicked order
      const bookingData = payments.find(payment => payment.orderId === orderId);
      if (!bookingData) {
        toast.error("No booking data found for this order.");
        return;
      }
  
      // Set processing state to disable the button
      setProcessingOrders(prevState => ({ ...prevState, [orderId]: true }));
  
      // Call API to save booking summary & send OTP
      const response = await axios.post("http://localhost:5000/api/save-booking-summary", bookingData);
  
      if (response.status === 200) {
        toast.success("Booking summary saved successfully and OTP sent.");
  
        // API Call to update the order status in the database
        await axios.post("http://localhost:5000/api/update-order-status", { orderId });
  
        // Update visitingStatus in local state
        setPayments(prevPayments =>
          prevPayments.map(payment =>
            payment.orderId === orderId ? { ...payment, visitingStatus: "In Process" } : payment
          )
        );
  
        // Navigate after all updates are done
        navigate("/booking-summary", { state: { bookingDetails: bookingData } });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed: ${error.message || error}`);
    } finally {
      // Ensure the button remains disabled
      setProcessingOrders(prevState => ({ ...prevState, [orderId]: true }));
    }
  };
  



  // Delete payment by ID
  // const deletePayment = async (paymentId) => {
  //   const confirmDelete = window.confirm("Are you sure you want to delete this payment?");
  //   if (!confirmDelete) return; // Exit if the user cancels
  
  //   try {
  //     const response = await axios.delete(`http://localhost:5000/api/admin/payments/${paymentId}`);
  //     toast.success("Payment deleted successfully.");
  //     setPayments(payments.filter((payment) => payment._id !== paymentId));
  //   } catch (error) {
  //     console.error("Error deleting payment:", error.response?.data || error.message);
  //     toast.error("Failed to delete payment.");
  //   }
  // };
  






  return (
    <div>

<div className="main-content">
  <div className="container-fluid">
    <AdminHeader/>

    <div className="row">
                        <div className="col-xl-12 col-lg-12">
                            <div className="breadcrumb-wrap mb-g bg-red-gradient">
                                <div className="row align-items-center">
                                    <div className="col-sm-12">
                                      <div className="dashboard-title">
                                        <h2>Booking Details</h2>
                                        
                                      </div>
                                    </div>
                                </div>
                            </div>
                            <ToastContainer /> 
                        </div>
                    </div>



                    <div className="row">
                      <div className="col-xl-12 col-lg-12">
                        <div className="breadcrumb-wrap">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Order ID</th>
                                  <th>User ID</th>
                                  <th>Customer Name</th>
                                  <th>Customer Mobile No</th>
                                  <th>Product Name</th>
                                  <th>Total Amount</th>
                                  <th>Product Quantity</th>
                                  <th>Visiting Date & Time</th>
                                  <th>Visiting Address</th>
                                  <th>Payment Method</th>
                                  <th>Payment Status</th>
                                  <th>Visiting Status</th>
                                  <th>Created Date</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                              {payments.map((payment, index) => (
            <tr key={payment._id}>
              <td>{index + 1}</td>
              <td>{payment.orderId}</td>
              <td>{payment.userId}</td>
              <td>
              {payment.address.map((item, index) => (
                  <div key={index}>
                    {item.fname}
                  </div>
                ))}
              </td>
              <td>{payment.mobile} </td>
              <td>
              {payment.cartItems.map((item, index) => (
              <div key={index}>
                <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.productName}
                              style={{ width: "auto", height: "50px", objectFit: "contain", display:"block", margin:"0px auto", borderRadius:"0px", }}
                            />
                    <p className="text-center">{item.productName}</p>
                    
                  </div>
                  ))}
              </td>
              <td>${payment.totalAmount}</td>
              <td>
                {payment.cartItems.map((item, index) => (
                  <div key={index}>
                      {item.quantity}
                  </div>
                ))}
              </td>
              <td>
                            {payment.datetime.map((item, index) => (
                              <div key={index}>
                                {item.date} {item.time && <span>{item.time}</span>}
                              </div>
                            ))}
              </td>
              <td>
                {payment.address.map((item, index) => (
                  <div key={index}>
                    {item.house}, {item.town}, {item.country} - {item.pincode}
                  </div>
                ))}
              </td>
              <td>{payment.paymentMethod}</td>
              <td>{payment.paymentStatus}</td>
              {/* <td>{payment.visitingStatus}</td> */}

              <td>
  <span
    style={{
      color: 
      payment.visitingStatus === "Completed" ? "green" :
      payment.visitingStatus === "In Process" ? "orange" :
      payment.visitingStatus === "Canceled" ? "red" : "",
      fontWeight: 
      payment.visitingStatus === "Completed" ? "bold" :
      payment.visitingStatus === "Canceled" ? "bold" :
      payment.visitingStatus === "In Process" ? "bold": "",
    }}
  >
    {payment.visitingStatus}
  </span>
</td>



              <td>{new Date(payment.createdAt).toLocaleString()}</td>
              <td>
                <div style={{display:"flex", gap:"10px"}}>
                <a className="btn btn-info" href="#" onClick={() => handleViewDetails(payment._id)}>View</a>
         
                {/* <button
                  className="btn btn-warning border-0"
                  disabled={payment.visitingStatus === "Canceled"}
                  style={{
                    backgroundColor: payment.visitingStatus === "Canceled" ? "gray" : "orange",
                    color: payment.visitingStatus === "Canceled" ? "white" : "black",
                    cursor: payment.visitingStatus === "Canceled" ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handlePendingClick(payment.orderId)}
                >
                  Pending
                </button> */}

{/* <button
  className="btn btn-warning border-0"
  disabled={payment.visitingStatus === "Canceled" || payment.visitingStatus === "In Process" || processingOrders[payment.orderId]}
  style={{
    backgroundColor: payment.visitingStatus === "Canceled" || payment.visitingStatus === "In Process" ? "gray" : "orange",
    color: payment.visitingStatus === "Canceled" || payment.visitingStatus === "In Process" ? "white" : "black",
    cursor: payment.visitingStatus === "Canceled" || payment.visitingStatus === "In Process" ? "not-allowed" : "pointer",
  }}
  onClick={() => handlePendingClick(payment.orderId)}
>
  {payment.visitingStatus === "In Process" || processingOrders[payment.orderId] ? "In Process" : "Pending"}

</button> */}

<button
  className="btn btn-warning border-0"
  disabled={["Canceled", "In Process", "Completed"].includes(payment.visitingStatus) || processingOrders[payment.orderId]}
  style={{
    backgroundColor:
      payment.visitingStatus === "Completed"
        ? "green"
        : ["Canceled"].includes(payment.visitingStatus) || processingOrders[payment.orderId]
        ? "grey"
        : ["In Process"].includes(payment.visitingStatus) || processingOrders[payment.orderId]
        ? "orange"
        : "blue",
    color:
      ["Canceled", "In Process", "Completed"].includes(payment.visitingStatus) || processingOrders[payment.orderId]
        ? "white"
        : "white",
    cursor:
      ["Canceled", "In Process", "Completed"].includes(payment.visitingStatus) || processingOrders[payment.orderId]
        ? "not-allowed"
        : "pointer",
  }}
  onClick={() => handlePendingClick(payment.orderId)}
>
  {payment.visitingStatus === "Completed"
    ? "Completed"
    : payment.visitingStatus === "Canceled" || processingOrders[payment.orderId]
    ? "Canceled"
    : payment.visitingStatus === "In Process" || processingOrders[payment.orderId]
    ? "In Process"
    : "Pending"}
</button>




                  {/* <button className="btn btn-danger" onClick={() => deletePayment(payment._id)}> Delete</button> */}
                
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

export default AdminPayment