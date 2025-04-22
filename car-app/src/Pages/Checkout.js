import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from '../Header';
import Footer from "../Footer";
import DateTimePicker from './DateTimePicker'
import Address from './Address'
import BookingSummary from "./BookingSummary";
import { useNavigate } from "react-router-dom";




const Checkout = () => {
const [addresses, setAddresses] = useState([]);
const [editAddress, setEditAddress] = useState(null); // Tracks the address being edited
const [formData, setFormData] = useState({
    fname: "",
    country: "",
    town: "",
    pincode: "",
    house: "",
    date:"",
    time:"",
    userId:"",
}); // Tracks form input data

const [user, setUser] = useState(null); // To store user details
const [total, setTotal] = useState(0); // Total amount from BookingSummary

  // Fetch user details from local storage on component mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser)); // Parse and set user data
    }
  }, []);

useEffect(() => {
const fetchAddresses = async () => {
try {
const response = await axios.get("http://localhost:5000/api/address");

if (user?._id) {
    // Filter entries by logged-in user's ID
    const filteredAddresses = response.data.filter(
        (address) => address.userId === user._id
      );
      setAddresses(filteredAddresses);
    }
} catch (error) {
alert("Error fetching addresses");
console.error(error);
}
};
fetchAddresses();
}, [user]);



const handleEditAddress = (address) => {
  setEditAddress(address); // Pass address to Address component
  setFormData(address);    // Pre-fill the form
};


const handleDeleteAddress = async (id) => {
  if (window.confirm("Are you sure you want to delete this address?")) {
      try {
          await axios.delete(`http://localhost:5000/api/address/${id}`);
          alert("Address deleted successfully!");
          setAddresses(addresses.filter((address) => address._id !== id)); // Remove from local state
      } catch (error) {
          alert("Error deleting address");
          console.error(error);
      }
  }
};




//*********date-and-time************************************* */


 // Date & Time Handling
 const [datetimes, setDatetimes] = useState([]); // List of all DateTime entries
 const [editDatetime, setEditDatetime] = useState(null); // Tracks the DateTime being edited

 // Fetch DateTime entries
 useEffect(() => {
    const fetchDatetimes = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/datetime");
          if (user?._id) {
            // Filter entries by logged-in user's ID
            const filteredDatetimes = response.data.filter(
              (datetime) => datetime.userId === user._id
            );
            setDatetimes(filteredDatetimes);
          }
        } catch (error) {
          alert("Error fetching Date & Time entries");
          console.error(error);
        }
      };
      fetchDatetimes();
    }, [user]);

 // Handle DateTime edit
 const handleEditDatetime = (datetime) => {
   setEditDatetime(datetime); // Set the DateTime being edited
   setFormData(datetime); // Pre-fill the form
 };

 // Handle DateTime delete
 const handleDeleteDatetime = async (id) => {
   if (window.confirm("Are you sure you want to delete this Date & Time?")) {
     try {
       await axios.delete(`http://localhost:5000/api/datetime/${id}`);
       alert("Date & Time deleted successfully!");
       // Optimistically update the local state
       setDatetimes((prevDatetimes) => prevDatetimes.filter((datetime) => datetime._id !== id));
     } catch (error) {
       alert("Error deleting Date & Time");
       console.error(error);
     }
   }
 };

 const navigate = useNavigate();
 const handleProceedToPayment = () => {
    navigate("/payment"); // Navigate to the checkout page
  };
  
 


return (
<div>
   <Header/>
   <div className="checkout-section-one">
   <div className="container">
   <div className="row">
         <div className="col-md-7">
            <div className="breadcrumb-wrap">
                <h1>Checkout</h1>
                <div className="card rounded-0 mb-2">
               <div className="card-body">
                  <ul className="checkout-detail">
                     <li>
                        <h4>Send Booking details To</h4>
                        {/* Display the user's mobile number */}
                        <p>{user?.mobile || "Mobile number not available"}</p>
                     </li>
                     <li>
                        <h4>Address</h4>
                        {addresses.length > 0 ? (
    addresses.map((address) => (
        <div key={address._id}>
            <p>{address.house}, {address.town}, {address.country} - {address.pincode}</p>
            <button data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEditAddress(address)} className="btn btn-link">Edit</button>
            <button onClick={() => handleDeleteAddress(address._id)} className="btn btn-link">Remove</button>
        </div>
    ))
) : (
    <p>No addresses found</p>
)}



{addresses.length === 0 && (
                        
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Add Address
                        </button>
                        )}
                        {/* Modal  */}
                        {/* Modal */}
<div
    className="modal fade"
    id="exampleModal"
    tabIndex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
>
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                    {editAddress ? "Edit Address" : "Add Address"}
                </h1>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
                <Address
                    editAddress={editAddress}
                    setEditAddress={setEditAddress}
                    formData={formData}
                    setFormData={setFormData}
                    setAddresses={setAddresses} // Optional if you want to update the address list
                    userId={user?._id}
                />
            </div>
        </div>
    </div>
</div>

                     </li>
                     <li>
                        <h4>Date & Time</h4>
                        {datetimes.length > 0 ? (
                    datetimes.map((datetime) => (
                        <div key={datetime._id}>
                            <p>
                                {datetime.date} &nbsp;&nbsp; {datetime.time}
                            </p>
                            <button
                                className="btn btn-link"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                                onClick={() => handleEditDatetime(datetime)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-link"
                                onClick={() => handleDeleteDatetime(datetime._id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No Date & Time slots found</p>
                )}
                     {/* Button to trigger modal */}
                {datetimes.length === 0 && (    
                <button
                    type="button"
                    className="btn btn-primary mt-3"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal1"
                >
                    Add Date & Time Slot
                </button>
                )}

                {/* Modal */}
                <div
                    className="modal fade"
                    id="exampleModal1"
                    tabIndex="-1"
                    aria-labelledby="exampleModal1Label"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModal1Label">
                                    Select Date and Time
                                </h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <DateTimePicker
                                    editDatetime={editDatetime}
                                    setEditDatetime={setEditDatetime}
                                    formData={formData}
                                    setFormData={setFormData}
                                    setDatetimes={setDatetimes} // Update DateTime list
                                    userId={user?._id}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                     </li>
                  </ul>
               </div>
            </div>
            </div>
         </div>
         <div className="col-md-5">
            <div className="cart-summary">
                <BookingSummary onTotalChange={setTotal} />
            </div>

            <div className="cart-summary">
                <button type="button" className="btn btn-primary btn-payment" onClick={handleProceedToPayment}>Pay ₹{total.toFixed(2)}</button>
            </div>
         </div>
      </div>




   </div>
   </div>

   <Footer/>
</div>
)
}
export default Checkout; 