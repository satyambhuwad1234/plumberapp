import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [taxesAndFee, setTaxesAndFee] = useState(0);
  const [total, setTotal] = useState(0);
  const visitationFee = 99; // Fixed visitation fee
  const navigate = useNavigate();

  // Fetch cart items for the logged-in user
  useEffect(() => {
    const fetchCartItems = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please log in to view your cart.");
        navigate("/login"); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/cart/user/${user._id}`
        );
        const items = response.data;
        setCartItems(items);
        calculateSubTotal(items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [navigate]);

  // Calculate subtotal
  const calculateSubTotal = (items) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.productSalePrice * item.quantity,
      0
    );
    setSubTotal(subtotal);

    const calculatedTaxes = subtotal * 0.1; // 10% taxes
    setTaxesAndFee(calculatedTaxes);

    const finalTotal = subtotal + calculatedTaxes + visitationFee;
    setTotal(finalTotal);
  };

  // Remove item from cart
  const handleRemoveItem = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${cartItemId}`);
      const updatedCartItems = cartItems.filter((item) => item._id !== cartItemId);
      setCartItems(updatedCartItems);
      calculateSubTotal(updatedCartItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Failed to remove item from cart.");
    }
  };

  // Handle checkout button click
  const handleCheckout = () => {
    navigate("/checkout"); // Navigate to the checkout page
  };

  return (
    <div>
      <Header />
      <div className="cart-section-one">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="breadcrumb-wrap">
                <h1>Cart Details</h1>
                {cartItems.length > 0 ? (
                  <table className="table table-stripped">
                    <thead>
                      <tr>
                        <th className="bg-secondary text-white" colSpan={2}>
                          Product
                        </th>
                        <th className="bg-secondary text-white">Quantity</th>
                        <th className="bg-secondary text-white" colSpan={2}>
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <img
                              src={`http://localhost:5000/uploads/${item.productImage}`}
                              alt={item.productName}
                              style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            />
                          </td>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.productSalePrice * item.quantity}</td>
                          <td>
                            <button
                              className="btn-home-delete"
                              onClick={() => handleRemoveItem(item._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={3} className="text-center">
                          Sub Total
                        </th>
                        <th colSpan={2}>₹{subTotal.toFixed(2)}</th>
                      </tr>
                    </tfoot>
                  </table>
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </div>
            </div>

            <div className="col-md-4">
          
  {cartItems.length > 0 && (
    <div className="cart-summary">
      <div className="card rounded-0 border-0">
        <div className="card-header bg-secondary text-white text-center px-3 py-3 rounded-0">
          <h4>Booking Summary</h4>
        </div>
        <div className="card-body">
          <div className="booking-summary-box booking-summary-box-border">
            <div className="booking-summary-box-left">
              <h5>Item Total</h5>
            </div>
            <div className="booking-summary-box-right">
              <h5>₹{subTotal.toFixed(2)}</h5>
            </div>
          </div>
          <div className="booking-summary-box booking-summary-box-border">
            <div className="booking-summary-box-left">
              <h5>Taxes and Fee (10%)</h5>
            </div>
            <div className="booking-summary-box-right">
              <h5>₹{taxesAndFee.toFixed(2)}</h5>
            </div>
          </div>
          <div className="booking-summary-box ">
            <div className="booking-summary-box-left">
              <h5>Visitation Fee</h5>
            </div>
            <div className="booking-summary-box-right">
              <h5>₹{visitationFee.toFixed(2)}</h5>
            </div>
          </div>
        </div>
        <div className="card-footer bg-secondary text-white rounded-0">
          <div className="booking-summary-box">
            <div className="booking-summary-box-left">
              <h5>
                <span>Total</span>
              </h5>
            </div>
            <div className="booking-summary-box-right">
              <h5>
                <span>₹{total.toFixed(2)}</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

            
          </div>

          <div className="row">
            <div className="col-md-12">
              {cartItems.length > 0 && (
                <button
                  type="button"
                  className="btn btn-primary mt-4"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
