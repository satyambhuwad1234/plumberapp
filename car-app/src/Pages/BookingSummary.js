import React, { useState, useEffect } from 'react';
import axios from "axios";

const BookingSummary = ({ onTotalChange }) => {
    const [subTotal, setSubTotal] = useState(0);
    const [taxesAndFee, setTaxesAndFee] = useState(0);
    const visitationFee = 99; // Fixed visitation fee
    const [total, setTotal] = useState(0);

    // Fetch cart items for the logged-in user
    useEffect(() => {
        const fetchCartItems = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                alert("Please log in to view your cart.");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:5000/api/cart/user/${user._id}`
                );
                calculateSubTotal(response.data);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();
    }, []);

    // Calculate subtotal, taxes, and total
    const calculateSubTotal = (items) => {
        const subtotal = items.reduce(
            (sum, item) => sum + item.productSalePrice * item.quantity,
            0
        );
        setSubTotal(subtotal);

        const calculatedTaxes = subtotal * 0.10; // 10% taxes
        setTaxesAndFee(calculatedTaxes);

        const finalTotal = subtotal + calculatedTaxes + visitationFee;
        setTotal(finalTotal);

        // Send total to the parent component
        onTotalChange(finalTotal);

        
    };

    return (
        <div>
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
                            <h5><span>Total</span></h5>
                        </div>
                        <div className="booking-summary-box-right">
                            <h5><span>₹{total.toFixed(2)}</span></h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSummary;

