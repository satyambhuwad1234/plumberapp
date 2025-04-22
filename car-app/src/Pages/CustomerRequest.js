import React, { useState } from "react";
import axios from "axios";

const CustomerRequest = () => {
  const [formData, setFormData] = useState({
    area: "",
    service_required: "",
  });
  const [providers, setProviders] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/customer-request", formData);
      setProviders(response.data.providers);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error fetching service providers");
    }
  };

  return (
    <div>
      <h2>Request a Service</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="area"
          placeholder="Enter your area"
          value={formData.area}
          onChange={handleChange}
        />
        <input
          type="text"
          name="service_required"
          placeholder="Service required"
          value={formData.service_required}
          onChange={handleChange}
        />
        <button type="submit">Submit Request</button>
      </form>

      {message && <p>{message}</p>}

      <h3>Matching Providers:</h3>
      <ul>
        {providers.map((provider) => (
          <li key={provider._id}>
            {provider.name} - {provider.service_name} - {provider.contact_number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerRequest;
