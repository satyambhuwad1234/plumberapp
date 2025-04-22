import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

const Orderdetails = () => {

  const { id } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/payment/${id}`);
        setPaymentDetails(response.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPaymentDetails();
  }, [id]);
  
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!paymentDetails) {
    return <p>No details found for this order.</p>;
  }



  return (
    <div>
        <div className="main-content">
            <div className="container-fluid">
                <AdminHeader />

                <div className="row">
                    <div className="col-md-12">
                       <div className="breadcrumb-wrap mb-g bg-red-gradient">
                             <div className="row align-items-center">
                                <div className="col-sm-12">
                                    <div className="dashboard-title" style={{justifyContent:"left"}}>
                                      <Link className="back-btn" to="/bookingdetails"><i class="bi bi-arrow-left-square-fill"></i></Link>  <h2>Order# : {paymentDetails.orderId}</h2> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="breadcrumb-wrap mb-1">

                        <div className="booking-detail-area-top">
                          <div className="d-flex">
                          <h5>Visiting On : </h5>
                          {paymentDetails.datetime.map((item, index) => (
                          <div key={index}>
                          <p> {item.date} {item.time && <span>{item.time}</span>}</p>
                          </div>
                          ))} 
                          </div>

                          <div className="d-flex">
                            <h5>Visiting Status :</h5><p>{paymentDetails.visitingStatus}</p>
                          </div>




                        </div>

                        </div>
                    </div>
                </div>



                <div className="row">
                    <div className="col-md-12">
                        <div className="breadcrumb-wrap">
                        
                          <div className="booking-detail-area">
                            <div className="row">
                              <div className="col-md-4">
                              <div className="booking-detail-left">
                                <h5>contact information</h5>
                                <p>
                                  <strong>Mobile:</strong> {paymentDetails.mobile}
                                </p>

                                <h5>Visiting Address</h5>
                                {paymentDetails.address.map((item, index) => (
                                <div key={index}>
                                  <p>{item.fname}</p>
                                  <p>
                                  {item.house}, 
                                  </p>
                                  <p>
                                  {item.town}, {item.country} - {item.pincode}
                                  </p>
                                </div>
                              ))}
                                
                              </div>
                              </div>

                              <div className="col-md-3">
                              <div className="booking-detail-left">
                                <h5>Payment Status</h5>
                                <p> {paymentDetails.paymentStatus}</p>
                                <h5>Payment Method</h5>
                                <p> {paymentDetails.paymentMethod}</p>
                              </div>
                              </div>

                              <div className="col-md-5">
                              <div className="booking-detail-right">
                                <div className="total-amount-box">
                                  <h5>Total Amount: ${paymentDetails.totalAmount}</h5>
                                </div>
                              <ul>
          {paymentDetails.cartItems.map((item) => (
            <li key={item._id}>
              <div className="booking-detail-img">
              <img src={`https://plumber.metiermedia.com/uploads/${item.image}`} alt={item.productName}
                              style={{ width: "auto", height: "50px", objectFit: "contain", display:"block", margin:"0px ", borderRadius:"0px", }}
                            />
              </div>
              <div className="booking-detail-quantity">
              {item.quantity}
              </div>
              <div className="booking-detail-product-name">
                 {item.productName} 
              </div>
              <div className="booking-detail-price">
                 ${(item.quantity * item.price).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
        <ul>
          <li style={{paddingBottom:"0px"}}>
            <div>
              <p>Taxes and Fees </p>
            </div>
            <div className="booking-detail-price">
              <p>${paymentDetails.taxesAndFee}</p>
            </div>
          </li>
          <li style={{paddingBottom:"0px"}}>
            <div>
              <p>Visitation Fees </p>
            </div>
            <div className="booking-detail-price">
            <p>${paymentDetails.visitationFee}</p>
            </div>
          </li>
          <li className="border-top pt-3">
            <div>
              <h4>Subtotal </h4>
            </div>
            <div className="booking-detail-price">
            <h4>${paymentDetails.totalAmount}</h4>
            </div>
          </li>
        </ul>
                              </div>
                              </div>
                            </div> 

                              {/* <div className="row">
                                <div className="col-md-12">
                                 <h5>Visiting Status : </h5>
                                 <div style={{display:"flex", gap:"10px"}}>
                                 <button className="btn btn-warning border-0"
                    disabled={paymentDetails.visitingStatus === "Canceled"}
                    style={{
                      backgroundColor:
                      paymentDetails.visitingStatus === "Canceled" ? "gray" : "orange",
                      color: 
                      paymentDetails.visitingStatus === "Canceled" ? "white": "black",
                      cursor: paymentDetails.visitingStatus === "Canceled" ? "not-allowed" : "pointer",
                    }}
                    onClick={() => alert("Pending action triggered!")}
                  >Pending</button>
                  </div>
                                </div>
                              </div>    */}
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

export default Orderdetails