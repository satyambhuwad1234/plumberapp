import React, { useEffect } from "react";
import axios from "axios";

const DateTimePicker = ({ editDatetime, setEditDatetime, formData, setFormData, setDatetimes }) => {
    const modalRef = React.useRef(null);

    useEffect(() => {
        if (editDatetime) {
            // Pre-fill the form with the selected DateTime details
            setFormData(editDatetime);
        } else {
            setFormData({ date: "", time: "" }); // Reset form when adding a new entry
        }
    }, [editDatetime, setFormData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Validation
        if (!formData.date || !formData.time) {
            alert("Both date and time are required.");
            return;
        }

        try {
            if (editDatetime) {
                // Update the existing DateTime entry
                await axios.put(`http://localhost:5000/api/datetime/${editDatetime._id}`, formData);
                alert("Date and time updated successfully!");
            } else {
                // Add a new DateTime entry
                const response = await axios.post("http://localhost:5000/api/datetime", formData);
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
            if (modalRef.current) {
                modalRef.current.click();
            }
        } catch (error) {
            console.error("Error saving date and time:", error);
            alert("Failed to save date and time.");
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
                        name="date"
                        className="form-control"
                        value={formData.date}
                        onChange={handleChange}
                        required // Ensure the field is filled
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="time" style={{ display: "block", marginBottom: "5px" }}>Pick a Time:</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        className="form-control"
                        value={formData.time}
                        onChange={handleChange}
                        required // Ensure the field is filled
                    />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                    {editDatetime ? "Update Date and Time" : "Add Date and Time"}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary w-100 mt-2"
                    data-bs-dismiss="modal"
                    ref={modalRef}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default DateTimePicker;
