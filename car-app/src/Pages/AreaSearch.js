import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AreaSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // Hook to navigate to other pages

    const handleSearch = async (e) => {
        const location = e.target.value; // Renamed 'term' to 'location'
        setSearchTerm(location);

        if (location.trim() === "") {
            setProducts([]);
            setErrorMessage("");
            return;
        }

        try {
            // Call the search API with 'location' as the query parameter
            const response = await axios.get(`http://localhost:5000/products/search?location=${location}`);
            setProducts(response.data); // Update product list
            setErrorMessage(""); // Clear error message
        } catch (error) {
            console.error("Error fetching products:", error);
            if (error.response && error.response.status === 404) {
                setProducts([]);
                setErrorMessage(error.response.data.message); // Show error message if no products found
            } else {
                setErrorMessage("An error occurred while fetching data.");
            }
        }
    };


     // Handle click on product result to navigate to category page
     const handleResultClick = (product) => {
        setSearchTerm(''); // Clear the search term
        setProducts([]); // Clear the search results

        // Check if the product has the category field, if not use a fallback
        const category = product?.productcategory || 'default-category'; // Fallback category if missing

        // Navigate to the category page
        navigate(`/category/${category}`);
    };

    return (
        <div className="product-search">
            <input
                type="text"
                className="form-control"
                placeholder="Search by City, Area, or Pincode"
                value={searchTerm}
                onChange={handleSearch} />
            {errorMessage && <p style={{ color: "brown" }} className="product-location-search-error">{errorMessage}</p>}
            {products.length > 0 && (
                <ul className="list-group product-location-search">
                    {products.map((product) => (
                        <li key={product._id} className="list-group-item" onClick={() => handleResultClick(product)}>
                            {product.productname}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AreaSearch;
