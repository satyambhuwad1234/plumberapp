import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

const Payment = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [taxesAndFee, setTaxesAndFee] = useState(0);
  const [visitationFee, setVisitationFee] = useState(99);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiryDate: "", cvv: "" });
  const [upiDetails, setUpiDetails] = useState({ upiId: "" });
  const [bankDetails, setBankDetails] = useState({ accountNumber: "", ifscCode: "" });
  const [datetimes, setDatetimes] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const navigate = useNavigate();

  // Fetch cart items and calculate total amount
  useEffect(() => {
    const fetchCartItems = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please log in to proceed.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/cart/user/${user._id}`);
        const items = response.data;
        setCartItems(items);

        const subTotal = items.reduce(
          (sum, item) => sum + item.productSalePrice * item.quantity,
          0
        );
        const taxes = subTotal * 0.1; // 10% taxes
        const total = subTotal + taxes + visitationFee;

        setTaxesAndFee(taxes);
        setTotalAmount(total);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);



 // Fetch DateTime entries
 useEffect(() => {
  const fetchDatetimes = async () => {
    const user = JSON.parse(localStorage.getItem("user")); // Define user here
    if (!user) {
      alert("Please log in to view available datetimes.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/datetime");
      // Filter entries by logged-in user's ID
      const filteredDatetimes = response.data.filter(
        (datetime) => datetime.userId === user._id
      );
      setDatetimes(filteredDatetimes);
    } catch (error) {
      alert("Error fetching Date & Time entries");
      console.error(error);
    }
  };
  fetchDatetimes();
}, []);


// Fetch Addresses entries
useEffect(() => {
  const fetchAddresses = async () => {
    const user = JSON.parse(localStorage.getItem("user")); // Define user here
    if (!user) {
      alert("Please log in to view available Addresses.");
      return;
    }
  try {
  const response = await axios.get("http://localhost:5000/api/address");

      // Filter entries by logged-in user's ID
      const filteredAddresses = response.data.filter(
          (address) => address.userId === user._id
        );
        setAddresses(filteredAddresses);

  } catch (error) {
  alert("Error fetching addresses");
  console.error(error);
  }
  };
  fetchAddresses();
  }, []);






  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("User not logged in.");
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    const cartItemsDetails = cartItems.map(item => ({
      productName: item.productName,
      image: item.productImage,
      quantity: item.quantity,
      price: item.productSalePrice,
    }));

    const paymentData = {
      orderId,
      userId: user._id,
      mobile: user.mobile,
      totalAmount,
      paymentStatus: "Paid",
      paymentMethod,
      cartItems: cartItemsDetails,
      datetime: datetimes, // <-- Correctly using 'datetimes' here
      address: addresses,
      taxesAndFee,
      visitationFee,
      createdDate: new Date().toISOString(),
      paymentDetails: paymentMethod === "Card" ? cardDetails : paymentMethod === "UPI" ? upiDetails : bankDetails,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/save-payment", paymentData);
      alert(response.data.message);

      // Move cart items to My Bookings after successful payment
      await moveCartItemsToBookings(user._id, cartItems);

      // Remove items from cart after payment
      await removeItemsFromCart(cartItems);

      navigate("/bookings");
    } catch (error) {
      console.error("Error saving payment:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to process payment. Please try again.");
    }
    
  };


   // Move cart items to My Bookings
   const moveCartItemsToBookings = async (userId, cartItems) => {
    try {
      await axios.post("http://localhost:5000/api/bookings", { userId, cartItems });
    } catch (error) {
      console.error("Error transferring cart items to My Bookings:", error);
    }
  };

  // Remove cart items from the database
  const removeItemsFromCart = async (items) => {
    try {
      await Promise.all(
        items.map((item) =>
          axios.delete(`http://localhost:5000/api/cart/remove/${item._id}`)
        )
      );
    } catch (error) {
      console.error("Error removing items from cart:", error);
    }
  };

  return (
    <div>
      <Header />
      <section className="payment-section-one">
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="breadcrumb-wrap">
                <h1>Payment Gateway Method</h1>
                <div className="payment-total">
                  <p className="text-center">Total Amount: ₹{totalAmount.toFixed(2)}</p>
                </div>
                <ul>
                  <li>
                    <button className="btn btn-payment-getway" onClick={() => setPaymentMethod("Card")}>
                      <div className="add-new-card">
                        <span><img src="/assets/images/card.png" alt="Card" width="80%" /></span>
                        Credit/Debit Card
                      </div>
                    </button>
                  </li>
                  <li>
                    <button className="btn btn-payment-getway" onClick={() => setPaymentMethod("UPI")}>
                      <div className="add-new-card">
                        <span><img src="/assets/images/upi.png" alt="UPI" width="80%" /></span>
                        UPI Payment
                      </div>
                    </button>
                  </li>
                  <li>
                    <button className="btn btn-payment-getway" onClick={() => setPaymentMethod("Netbanking")}>
                      <div className="add-new-card">
                        <span><img src="/assets/images/netbanking.png" alt="Netbanking" width="80%" /></span>
                        Net Banking
                      </div>
                    </button>
                  </li>
                </ul>

                {/* Conditionally render payment form */}
                {paymentMethod === "Card" && (
                  <div className="payment-form">
                    <input type="text" placeholder="Card Number" value={cardDetails.cardNumber} onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })} />
                    <input type="text" placeholder="Expiry Date (MM/YY)" value={cardDetails.expiryDate} onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })} />
                    <input type="text" placeholder="CVV" value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} />
                  </div>
                )}
                {paymentMethod === "UPI" && (
                  <div className="payment-form">
                    <input type="text" placeholder="Enter UPI ID" value={upiDetails.upiId} onChange={(e) => setUpiDetails({ ...upiDetails, upiId: e.target.value })} />
                  </div>
                )}
                {paymentMethod === "Netbanking" && (
                  <div className="payment-form">
                    <input type="text" placeholder="Account Number" value={bankDetails.accountNumber} onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} />
                    <input type="text" placeholder="IFSC Code" value={bankDetails.ifscCode} onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })} />
                  </div>
                )}

                <button className="btn btn-primary mt-4" onClick={handlePayment}>Confirm Payment</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Payment;
