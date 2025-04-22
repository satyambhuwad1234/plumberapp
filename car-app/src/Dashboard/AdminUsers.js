import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/adminusers`);
        console.log("API Response:", response.data); // Log the API response
        setAdminUsers(response.data);
      } catch (error) {
        console.error("Error fetching admin users:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAdminUsers();
  }, []);
  



const navigate = useNavigate();
// Navigate to the user profile view
const handleViewPage = (userId) => {
    navigate(`/adminusers/${userId}`);
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/adminusers/${userId}`);
      alert("User deleted successfully!");
      // Update the user list after deletion
      setAdminUsers(adminUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error);
      alert("Failed to delete the user.");
    }
  };



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
                      <h2>Users</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr. No.</th>
                            <th>User Name</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact Number</th>
                            <th>User Type</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
      {adminUsers.length > 0 ? (
        adminUsers.map((user, index) => (
          <tr
            key={user._id} style={{ cursor: "pointer" }}
          >
            <td>{index + 1}</td>
            <td>{user.username || "N/A"}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.contact_number}</td>
            <td>{user.role}</td>
            <td>
                <button onClick={() => handleViewPage(user._id)} className="btn btn-primary btn-sm "> View </button>
                <button onClick={() => handleDeleteUser(user._id)} className="btn btn-danger btn-sm">Delete</button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-center">
            No users found.
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
      </div>
    </div>
  );
};

export default AdminUsers;
