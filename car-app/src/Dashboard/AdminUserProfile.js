import React, { useEffect, useState } from "react";
import AdminHeader from './AdminHeader'; // Assuming this component exists
import { useParams } from "react-router-dom";
import axios from "axios";

const AdminUserProfile = () => {
  const { id } = useParams(); // Extract the user ID from the URL
  const [user, setUser] = useState(null);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Make sure to use backticks for template literals
        const response = await axios.get(`http://localhost:5000/api/adminusers/${id}`);
        
        // Check if response.data exists
        if (response.data) {
          setUser(response.data); 
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError("Failed to fetch user details.");
        console.error("Error fetching user details:", err); // Log the error to the console
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]); // Dependency array ensures useEffect runs when `id` changes





  

  if (loading) {
    return <p>Loading...</p>; // Display loading message while data is being fetched
  }

  if (error) {
    return <p>{error}</p>; // Display any error encountered during fetching
  }

  if (!user) {
    return <p>User not found.</p>; // Display if user data is not found
  }

  return (
    <div>
      <div className="main-content">
        <div className="container-fluid">
          <AdminHeader /> {/* Assuming AdminHeader is a component for the page header */}

          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="breadcrumb-wrap mb-g bg-red-gradient">
                <div className="row align-items-center">
                  <div className="col-sm-12">
                    <div className="dashboard-title">
                      <h2>User Profile</h2> {/* Page title */}
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
                  {/* Display user information */}
                  <p>
                    <strong>Name:</strong> {user.name || "No name provided"}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email || "No email provided"}
                  </p>
                  <p>
                    <strong>Contact Number:</strong> {user.contact_number || "No contact number provided"}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role || "No role assigned"}
                  </p>
                  <p>
                    <strong>Service Name:</strong> {user.service_name || "No role assigned"}
                  </p>
                  <p>
                    <strong>Address:</strong> {user.address || "No role assigned"}
                  </p>
                  <p>
                    <strong>Area:</strong> {user.area || "No role assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminUserProfile;
