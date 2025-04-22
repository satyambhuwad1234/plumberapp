import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import axios from "axios";
import AreaSearch from './Pages/AreaSearch';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMobile, setUserMobile] = useState(''); 
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Check login state on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setUserMobile(user.mobile); // Set mobile number from the logged-in user data
      }
    }
  }, []);

  // Fetch cart item count for logged-in user
  useEffect(() => {
    const fetchCartCount = async () => {
      if (isLoggedIn) { // Fetch cart count only if user is logged in
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          try {
            const response = await axios.get(`http://localhost:5000/api/cart/user/${user._id}`);
            setCartCount(response.data.length); // Set cart count to number of items
          } catch (error) {
            console.error("Error fetching cart items:", error);
          }
        }
      } else {
        setCartCount(0); // Reset cart count when user is not logged in
      }
    };

    fetchCartCount();
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    navigate("/login");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user"); // Clear user info on logout
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/products/search/${term}`);
      console.log(response.data); // Log the response data to verify its structure
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleResultClick = (product) => {
    setSearchTerm(''); // Clear the search term
    setSearchResults([]); // Clear the search results
  
    // Check if the product has the category field
    const category = product?.productcategory || 'default-category'; // Fallback category if missing
  
    navigate(`/category/${category}`); // Navigate to the category page
  };
  
  




  return (
    <header className="header">
      <div className="navbar">
        <div className="main-logo">
          <Link to="/">logo</Link>
        </div>
        <div className="search-area">
          <div className="search-services">
        <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                <ul className="list-group">
                  {searchResults.map((product) => (
                    <li
                      key={product._id}
                      className="list-group-item"
                      onClick={() => handleResultClick(product)}
                    >
                      {product.productname}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          
        </div>

        <div>
          <AreaSearch />
        </div>
        </div>
        <ul className="nav">
          {isLoggedIn && (
            <>
            <li>
              <Link to="/bookings">My Booking</Link>
            </li>
            <li>
              <Link to="/cart">
                <FaCartShopping />
                {/* Display the cart item count */}
                {cartCount > 0 && (
                  <span className="badge bg-danger ms-2">{cartCount}</span>
                )}
              </Link>
            </li>
            </>
          )}
          <li className="login-dropdown">
            <a href="#" onClick={toggleDropdown}>
              <FaUserCircle />
            </a>
            {showDropdown && (
              <ul className="login-dropdown-content">
                {!isLoggedIn && (
                  <li>
                    <button className="text-white" onClick={handleLogin}>Login</button>
                  </li>
                )}
                {isLoggedIn && (
                  <>
                  <li>
                  <span className="text-white"> {userMobile}</span>
                </li>
                  <li>
                    <button className="text-white" onClick={handleLogout}>Logout</button>
                  </li>
                  </>
                )}
              </ul>
            )}
          </li>
        </ul>
      </div>

      </header>

    
  );
};

export default Header;
