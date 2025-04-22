import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

const BookingSummaryDetails = () => {
  const { id } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking; // If booking was passed via navigation state
  const visitationFee = 99; // Fixed visitation fee

  

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/all-booking-summaries/${id}`);
        console.log("API Response:", response.data); // Debugging
        setBookingDetails(response.data);
      } catch (error) {
        console.error("Error fetching Booking Summary details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!booking) {
      fetchBookingDetails();
    } else {
      setBookingDetails(booking);
      setLoading(false);
    }
  }, [id, booking]);

  if (loading) return <p>Loading...</p>;
  if (!bookingDetails) return <p>No details found for this order.</p>;



  // Calculate subtotal
const subtotal = bookingDetails.cartItems.reduce(
  (sum, item) => sum + item.quantity * item.price,
  0
);

// Calculate taxes (10% of subtotal)
const taxesAndFee = subtotal * 0.1;

// Calculate total amount
const totalAmount = subtotal + taxesAndFee + visitationFee;



const openPrintWindow = () => {
  const printWindow = window.open( "width=800,height=600");


    const printContent = `
    <html>
    <head>
       
      <style>
        @media print {
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
          }
          .print-container { 
              border: 1px solid black; 
              padding: 20px;
           }
          table { 
             width: 100%; 
             border-collapse: collapse; 
             margin-top: 20px; 
          }
          th, td {
             border: 1px solid black; 
             padding: 10px; 
             text-align: left; 
          }
          .no-print { 
             display: none; 
          } 

          .print-heading{
             width:100%;
             height:auto;
             display:flex;
             align-item:top;
             margin-bottom:50px;
          }
          .print-heading-left{
             width:50%;
             height:auto;
             display:block;
             position:relative;
          }
          .print-heading-left img{
             width:150px;
             height:auto;
             display:block;
             position:relative;

          }
          .print-heading-right{
             width:50%;
             height:auto;
             display:block;
             position:relative;
          }
          .print-heading-right h4{
             font-size:18px;
             font-weight:600;
             margin-top:0px;
             text-align:right;
          }
          .print-heading-right h4 span{
             font-weight:400;
          }
          .print-section-two{
             width:100%;
             height:auto;
             display:flex;
             position:relative;
          }
          .print-section-two-left{
             width:50%;
             height:auto;
             display:block;
             position:relative;
          }
          .print-section-two-left p{
             margin-bottom:0px !important;
          }
          .print-section-two-right{
             width:50%;
             height:auto;
             display:block;
             position:relative;
          }
             .print-section-two-right h4{
             text-align:right;
          }
          .print-section-two-right p{
             margin-bottom:0px !important;
             text-align:right;
          }
          .text-align-left{
             text-align:left;
          }
          .print-section-three{
            width:100%;
            height:auto;
            display:flex;
            position:relative;
          }
          .print-section-three-left{
            width:55%;
            height:auto;
            display:block;
            position:relative;
          }
          .print-section-three-right{
            width:45%;
            height:auto;
            display:block;
            position:relative;
          }
          .print-section-three-right p{
             text-align:right;
          }
          .print-section-four{
            margin-top:40px;
          }
          .print-section-four h4{
            text-align:right;
            font-size:16px;
            font-weight:600;
            margin-top:40px;
          }
          .print-section-five{
            width:100%;
            height:auto;
            display:block;
            position:relative;
            margin-top:50px;
          }
          .print-section-five p{
            font-size:10px;
            text-align:center;
          }
      </style>
    </head>
    <body>
      <div class="print-container">
        <div class="print-heading">
          <div class="print-heading-left">
            <img src="/assets/images/logo.png" id="logoBig" alt="Logo" />
          </div>
          <div class="print-heading-right">
            <h4>
              Tax Invoice/Bill of Supply/Cash Memo <span>(Original for Recipient)</span>
            </h4>
          </div>
        </div>

        <div class="print-section-two">
          <div class="print-section-two-left">
             <h4>
               Service Partner
             </h4>
             ${bookingDetails.servicePartners
              .map(
                (partner) => `
              <div>
                <p>${partner.name || "N/A"}</p>
                <p>${partner.email || "N/A"}</p>
                <p>${partner.contact_number || "N/A"}</p>
                <p>${partner.service_name || "N/A"}</p>
                <p>${partner.address || "N/A"}, ${partner.area || "N/A"}</p>
                <p>${partner.city || "N/A"} - ${partner.pincode || "N/A"}</p>
                <p></p>
              </div>`
              )
              .join("")}
          </div>
          <div class="print-section-two-right">
          <h4>
               Customer Details
             </h4>
             <p className="mb-0"> ${bookingDetails.mobile || "N/A"}</p>
             ${bookingDetails.address
              .map(
                (address) => `
              <div>
                <p>${address.fname || "N/A"}</p>
                <p>${address.house|| "N/A"}, ${address.town || "N/A"}</p>
                <p>${address.country || "N/A"} - ${address.pincode|| "N/A"}</p>
              </div>`
              )
              .join("")}
              
          </div>
        </div>

        <div class="print-section-three">
          <div class="print-section-three-left">
            <p><strong>Order Number : </strong> ${bookingDetails.orderId}</p>
          </div>
          <div class="print-section-three-right">
          ${bookingDetails.datetime
            .map(
              (datetime) => `
            <p>
              <p><strong>Order Date : </strong> ${datetime.date || "N/A"}</p>
            </p>`
            )
            .join("")}
          </div>
        
        </div>


        <table>
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Service</th>
              <th>Quintity</th>
              <th>Net Amount</th>
            </tr>
          </thead>
          <tbody>
          
            <tr>
            ${bookingDetails.cartItems
              .map(
                (item, index) => `
              <td>${index + 1}</td>
              <td>${item.productName || "N/A"}</td>
              <td>${item.quantity || "N/A"}</td>
              <td>₹ ${item.quantity * item.price}</td>
            </tr>`
            )
            .join("")}


            <tr>
              <th colspan="3" class="text-align-left">
                Sub Total
              </th>
              <th>
                ₹ ${subtotal}
              </th>
            </tr>

            <tr>
              <th colspan="3" class="text-align-left">Taxes (10%)</th>
              <td>₹ ${taxesAndFee.toFixed(2)}</td>
            </tr>
            <tr>
              <th colspan="3" class="text-align-left">Visitation Fee</th>
              <td>₹ ${visitationFee}</td>
            </tr>
            <tr>
              <th colspan="3" class="text-align-left">Total Amount</th>
              <th>₹ ${totalAmount}</th>
            </tr>
          </tbody>
        </table>

        <div class="print-section-four">
          <h4>
            Metier Media Private Limited:
          </h4>
          
          <h4>
            Authorized Signatory
          </h4>
        </div>
        <div class="print-section-five">
           <p>
             5B1, Gundecha Onclave Kherani Road, Sakinaka, Andheri MUMBAI, MAHARASHTRA, 400072 
           </p>
        </div>

      </div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(() => window.close(), 500);
        };
      </script>
    </body>
    </html>
  `;

printWindow.document.write(printContent);
printWindow.document.close();

};






  return (
    <div className="main-content">
            <div className="container-fluid">
                <AdminHeader/>


      <div className="row">
                          <div className="col-md-12">
                             <div className="breadcrumb-wrap mb-g bg-red-gradient">
                                   <div className="row align-items-center">
                                      <div className="col-sm-12">
                                          <div className="dashboard-title" style={{justifyContent:"space-between"}}>
                                              <h2>Order# : {bookingDetails.orderId}</h2> 
                                              <button className="btn btn-warning" onClick={() => openPrintWindow(bookingDetails)}>Invoice</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
      

      <div className="row">
        <div className="col-md-7">
          <div className="card">
            <div className="card-body">
            <h5> Visiting status</h5>
            <p className="mb-0">
              {bookingDetails.visitingStatus}
            </p>
            <p className="mb-0">
  
  {bookingDetails.datetime && bookingDetails.datetime.length > 0
    ? bookingDetails.datetime.map((datetime) => `${datetime.date}, ${datetime.time}`).join(", ")
    : "No service partners assigned"}
</p>
            </div>
          </div>

          <div className="card mt-2">
            <div className="card-body">
              <h5>Customer Information</h5>
              <p className="mb-0"> {bookingDetails.mobile}</p>
              <p className="mb-0">
  {bookingDetails.address && bookingDetails.address.length > 0
    ? bookingDetails.address.map((address) => `${address.fname}`).join(", ")
    : "No service partners assigned"}
</p>
<p className="mb-0">
  {bookingDetails.address && bookingDetails.address.length > 0
    ? bookingDetails.address.map((address) => `${address.house}, ${address.town}, ${address.country}, ${address.pincode}`).join(", ")
    : "No service partners assigned"}
</p>
            </div>
          </div>

          <div className="card mt-2">
            <div className="card-body">
              <h5>payment Details</h5>
              <p className="mb-0"> {bookingDetails.paymentMethod}</p>
              <p className="mb-0"> ₹{bookingDetails.totalAmount}</p>
              <p className="mb-0"> {bookingDetails.paymentStatus}</p>
            </div>
          </div>


          <div className="card mt-2">
            <div className="card-body">
              <h5>Service Partner</h5>
              <p className="mb-0">
                {bookingDetails.servicePartners && bookingDetails.servicePartners.length > 0
                ? bookingDetails.servicePartners.map((partner) => `${partner.name}`).join(", ")
                : "No service partners assigned"}
              </p>
              <p className="mb-0">
                {bookingDetails.servicePartners && bookingDetails.servicePartners.length > 0
                ? bookingDetails.servicePartners.map((partner) => `${partner.email}`).join(", ")
                : "No service partners assigned"}
              </p>
              <p className="mb-0">
               +91 {bookingDetails.servicePartners && bookingDetails.servicePartners.length > 0
                ? bookingDetails.servicePartners.map((partner) => `${partner.contact_number}`).join(", ")
                : "No service partners assigned"}
              </p>
              <p className="mb-0">
                {bookingDetails.servicePartners && bookingDetails.servicePartners.length > 0
                ? bookingDetails.servicePartners.map((partner) => `${partner.address}, ${partner.area}, ${partner.city}, ${partner.pincode}`).join(", ")
                : "No service partners assigned"}
              </p>
            </div>
          </div>




        </div>
        <div className="col-md-5">
          <div className="card">
            <div className="card-body">
              
              <h5>Total Amount </h5>
              <p className="mb-0">
               <b> ₹ {bookingDetails.totalAmount}</b>
              </p>
            </div>
          </div>

          <div className="card mt-2">
            <div className="card-body">
              <table className="table table-bordered">
              {bookingDetails.cartItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img src={`https://plumber.metiermedia.com/uploads/${item.image}`} alt={item.productName}
                              style={{ width: "auto", height: "50px", objectFit: "contain", display:"block", margin:"0px ", borderRadius:"0px", }}></img>
                  </td>
                  <td>
                    {item.quantity}
                  </td>
                  <td style={{whiteSpace:"normal"}}>
                    {item.productName}
                  </td>
                  <td>
                  ₹ {(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
                ))}

                <tr>
                  <td colSpan="3">Sub Total</td>
                  <td>₹ {bookingDetails.cartItems.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}</td>
                </tr>
                {/* Calculate Taxes (10% of subtotal) */}
                <tr>
                  <td colSpan="3">Taxes and Fee (10%)</td>
                  <td>₹ {bookingDetails.taxesAndFee}</td>
                </tr>
                       {/* visitation fee */}
                <tr>
                  <td colSpan="3">Visitation Fee</td>
                  <td>₹ {bookingDetails.visitationFee}</td>
                </tr>

                <tr>
                  <td colSpan="3">
                    <h5>Total Amount</h5>
                  </td>
                  <td>
                    <h5>
                    ₹ {bookingDetails.totalAmount}
                    </h5>
                  </td>
                </tr>

              </table>
            </div>
          </div>


        </div>
      </div>

     
      <button className="btn btn-primary mt-4 mb-4" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
    <AdminFooter/>
    </div>
    
  );
};

export default BookingSummaryDetails;
