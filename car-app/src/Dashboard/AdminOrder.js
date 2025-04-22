import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import axios from "axios";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <div className="main-content">
        <div className="container-fluid">
          <AdminHeader />

          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="breadcrumb-wrap mb-g bg-red-gradient">
                <div className="row align-items-center">
                  <div className="col-sm-12">
                    <div className="dashboard-title">
                      <h2>Order Details</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-wrap">
                {loading ? (
                  <p>Loading orders...</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>User ID</th>
                          <th>User Name</th>
                          <th>User Mobile</th>
                          <th>Items Quantity</th>
                          <th>Address</th>
                          <th>Date & Time</th>
                          <th>Payment Status</th>
                          <th>Visiting Status</th>
                          <th>Action</th>
                          <th>Print</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length > 0 ? (
                          orders.map((order) => (
                            <tr key={order.orderId}>
                              <td>{order.orderId}</td>
                              <td>{order.userId}</td>
                              <td>{order.userName}</td>
                              <td>{order.userMobile}</td>
                              <td>{order.items.length}</td>
                              <td>{order.address}</td>
                              <td>{new Date(order.createdDate).toLocaleString()}</td>
                              <td>{order.paymentStatus}</td>
                              <td>{order.visitingStatus}</td>
                              <td>
                                <a href="#">Edit</a> <a href="#">Delete</a>{" "}
                                <a href="#">View</a>
                              </td>
                              <td>
                                <a href="#">Print</a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="11" className="text-center">
                              No orders found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminOrder;
