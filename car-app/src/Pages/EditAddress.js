import axios from "axios";
import React, { useEffect, useState } from "react";

const EditAddress = () => {

    const [addresses, setAddresses] = useState([]);
    const [formData, setFormData] = useState({
        fname: "",
        country: "",
        town: "",
        pincode: "",
        house: "",
        landmark: "",
    });
    const [editAddress, setEditAddress] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/address");
            setAddresses(response.data);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editAddress) {
                // Update address
                await axios.put(`http://localhost:5000/api/address/${editAddress._id}`, formData);
                alert("Address updated successfully!");
            } else {
                // Add new address
                await axios.post("http://localhost:5000/api/address", formData);
                alert("Address added successfully!");
            }
            setFormData({ fname: "", country: "", town: "", pincode: "", house: "", landmark: "" });
            setEditAddress(null);
            fetchAddresses();
        } catch (error) {
            console.error("Error saving address:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await axios.delete(`http://localhost:5000/api/address/${id}`);
                alert("Address deleted successfully!");
                fetchAddresses();
            } catch (error) {
                console.error("Error deleting address:", error);
            }
        }
    };

    const handleEdit = (address) => {
        setEditAddress(address);
        setFormData(address);
    };

  return (
    <div>

<div className="container">
            <h1>Manage Addresses</h1>
            <form onSubmit={handleAddOrUpdate}>
                <div className="mb-3">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fname"
                        className="form-control"
                        value={formData.fname}
                        onChange={(e) => setFormData({...formData, fname: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label>Country</label>
                    <input
                        type="text"
                        name="country"
                        className="form-control"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label>Town/City</label>
                    <input
                        type="text"
                        name="town"
                        className="form-control"
                        value={formData.town}
                        onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label>Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        className="form-control"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label>Flat, House no., etc.</label>
                    <input
                        type="text"
                        name="house"
                        className="form-control"
                        value={formData.house}
                        onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label>Landmark</label>
                    <input
                        type="text"
                        name="landmark"
                        className="form-control"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {editAddress ? "Update Address" : "Add Address"}
                </button>
            </form>

            <h2>Saved Addresses</h2>
            {addresses.length > 0 ? (
                addresses.map((address) => (
                    <div key={address._id} className="card mt-3">
                        <div className="card-body">
                            <p>
                                {address.fname}, {address.house}, {address.town}, {address.country} -{" "}
                                {address.pincode}
                            </p>
                            <button className="btn btn-warning me-2" onClick={() => handleEdit(address)}>
                                Edit
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(address._id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No addresses found</p>
            )}
        </div>

    </div>
  )
}

export default EditAddress