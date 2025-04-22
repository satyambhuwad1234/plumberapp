import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminHeader from "./AdminHeader";

const PartnerDetailPage = () => {

    const { id } = useParams(); // Get the partner ID from the URL
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/servicepartner/${id}`);
        setPartner(response.data);
      } catch (error) {
        console.error("Error fetching partner details:", error);
      }
    };
    fetchPartnerDetails();
  }, [id]);

  if (!partner) {
    return <p>Loading...</p>;
  }


  return (
    <div>
        <div className="main-content">
            <div className="container-fluid">
                <AdminHeader />
                <div className="row">
                    <div className="col-lg-12 col-xl-12">
                        <div className="breadcrumb-wrap mb-g bg-red-gradient">
                                                    <div className="row align-items-center">
                                                        <div className="col-sm-12">
                                                            <div className="dashboard-title">
                                                              <h2>{partner.name}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ToastContainer />
                        
                       
                        
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="breadcrumb-wrap">
                        
      <p><strong>Name:</strong> {partner.name}</p>
      <p><strong>Email:</strong> {partner.email}</p>
      <p><strong>Contact Number:</strong> {partner.contact_number}</p>
      <p><strong>Service Name:</strong> {partner.service_name}</p>
      <p><strong>Address:</strong> {partner.address}</p>
      <p><strong>Area:</strong> {partner.area}</p>
      <p><strong>Pincode:</strong> {partner.pincode}</p>
                        </div>
                        </div>
                        </div>


            </div>
        </div>
    </div>
  )
}

export default PartnerDetailPage