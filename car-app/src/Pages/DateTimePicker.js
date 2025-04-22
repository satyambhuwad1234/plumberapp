import React, { useEffect } from "react";
import axios from "axios";

const DateTimePicker = ({ editDatetime, setEditDatetime, formData, setFormData, setDatetimes, userId }) => {
    useEffect(() => {
        if (editDatetime) {
            // Pre-fill the form with the selected DateTime details
            setFormData(editDatetime);
        }
    }, [editDatetime, setFormData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
    
        const dataToSubmit = { 
            ...formData,
            userId: userId // Add userId to the data that will be sent to the backend
        };
    
        try {
            if (editDatetime) {
                // Update the existing DateTime entry
                await axios.put(`http://localhost:5000/api/datetime/${editDatetime._id}`, dataToSubmit);
                alert("Date and time updated successfully!");
            } else {
                // Add a new DateTime entry
                const response = await axios.post("http://localhost:5000/api/datetime", dataToSubmit);
                alert("Date and time added successfully!");
                setDatetimes((prev) => [...prev, response.data]); // Add to the DateTime list
            }
    
            // Reset form and edit state
            setFormData({
                date: "",
                time: "",
            });
            setEditDatetime(null);
    
            // Close modal
            document.querySelector('[data-bs-dismiss="modal"]').click();
        } catch (error) {
            // Check if the error has a response from the server
            if (error.response) {
                // If response exists, log the response details (status code and message)
                console.error("Error saving date and time:", error.response.data);
                alert(`Error: ${error.response.data.message || "Something went wrong"}`);
            } else {
                // If no response (network or other issues), log the error object itself
                console.error("Error saving date and time:", error);
                alert("Failed to save date and time due to a network error.");
            }
        }
    };
    


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="date" style={{ display: "block", marginBottom: "5px" }}>Pick a Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date" // Add name attribute
                        className="form-control"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="time" style={{ display: "block", marginBottom: "5px" }}>Pick a Time:</label>
                    <input
                        type="time"
                        id="time"
                        name="time" // Add name attribute
                        className="form-control"
                        value={formData.time}
                        onChange={handleChange}
                    />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                    {editDatetime ? "Update Date and Time" : "Add Date and Time"}
                </button>
            </form>
        </div>
    );
};

export default DateTimePicker;
