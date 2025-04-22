import React, { useEffect } from "react";
import axios from "axios";


const Address = ({ editAddress, setEditAddress, formData, setFormData, setAddresses }) => {
    useEffect(() => {
        if (editAddress) {
            // Pre-fill the form with the selected address details
            setFormData(editAddress);
        }
    }, [editAddress, setFormData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (editAddress) {
                // Update the existing address
                await axios.put(`https://plumber.metiermedia.com:5000/api/address/${editAddress._id}`, formData);
                alert("Address updated successfully!");
            } else {
                // Add a new address
                const response = await axios.post("https://plumber.metiermedia.com:5000/api/address", formData);
                alert("Address added successfully!");
                setAddresses((prev) => [...prev, response.data]); // Add to the address list
            }

            // Reset form and edit state
            setFormData({
                fname: "",
                country: "",
                town: "",
                pincode: "",
                house: "",
            });
            setEditAddress(null);

            // Close modal
            document.querySelector('[data-bs-dismiss="modal"]').click();
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Failed to save address.");
        }
    };

    return (
        <form>
            <div className="mb-3">
                <label htmlFor="fname" className="form-label">Full Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="fname"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="town" className="form-label">Town</label>
                <input
                    type="text"
                    className="form-control"
                    id="town"
                    name="town"
                    value={formData.town}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="pincode" className="form-label">Pincode</label>
                <input
                    type="text"
                    className="form-control"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="house" className="form-label">House</label>
                <input
                    type="text"
                    className="form-control"
                    id="house"
                    name="house"
                    value={formData.house}
                    onChange={handleChange}
                />
            </div>
            <button type="button" className="btn btn-primary w-100" onClick={handleSubmit}>
                {editAddress ? "Update Address" : "Add Address"}
            </button>
        </form>
    );
};

export default Address;
