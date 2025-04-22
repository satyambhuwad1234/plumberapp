import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminHeader from './AdminHeader';
import { useNavigate } from "react-router-dom";

const PartnerDetails = () => {

    const [partners, setPartners] = useState([]);
    const navigate = useNavigate();
    const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Fetch service partners
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get("http://localhost:5000/servicepartners");

        setPartners(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch partners");
      }
    };
    fetchPartners();
  }, []);

  // Delete service partner
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/servicepartner/${id}`);
      setPartners((prev) => prev.filter((partner) => partner._id !== id));
      toast.success("Partner deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete partner");
    }
  };


  const handleEdit = (id) => {
    const partnerToEdit = partners.find((partner) => partner._id === id);
    setEditingId(id);
    setEditData({ ...partnerToEdit }); // Prefill edit data with partner details
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/servicepartner/${editingId}`, editData);
      setPartners((prev) =>
        prev.map((partner) =>
          partner._id === editingId ? { ...editData } : partner
        )
      );
      setEditingId(null); // Exit edit mode
      toast.success("Partner details updated successfully!");
    } catch (error) {
      console.error("Error updating partner:", error);
      toast.error("Failed to update partner details.");
    }
  };

  const handleCancel = () => {
    setEditingId(null); // Exit edit mode without saving
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
                                      <h2>Partners Details</h2>
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
                           <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Partner Name</th>
                                            <th>Service Name</th>
                                            <th> Mobile No</th>
                                            <th>Email ID</th>
                                            <th>Address</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
          {partners.map((partner) =>
            editingId === partner._id ? (
              <tr key={partner._id}>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="service_name"
                    value={editData.service_name}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="contact_number"
                    value={editData.contact_number}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="address"
                    value={editData.address}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <button className="btn btn-save btn-success" onClick={handleSave}>
                    Save
                  </button>&nbsp;
                  <button className="btn btn-cancel btn-danger" onClick={handleCancel}>
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={partner._id}>
                <td>{partner.name}</td>
                <td>{partner.service_name}</td>
                <td>{partner.contact_number}</td>
                <td>{partner.email}</td>
                <td>{partner.address} {partner.area} - {partner.pincode}</td>
                <td>
                    <button className="btn btn-view" onClick={() => navigate(`/servicepartner/${partner._id}`)}>
                        <i className="bi bi-eye-fill"></i>
                    </button>
                    <button className="btn btn-edit" onClick={() => handleEdit(partner._id)}>
                        <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn-home-delete" onClick={() => handleDelete(partner._id)}>
                        <i className="bi bi-trash"></i>
                    </button>
                </td>
              </tr>
            )
          )}
        </tbody>
                                    
                                   
                                </table>
                           </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    </div>
  )
}

export default PartnerDetails