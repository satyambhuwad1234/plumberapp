import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header';
import Footer from '../Footer';

const CategoryPage = () => {
  const { categoryTitle } = useParams(); // Get the category title from URL params
  const navigate = useNavigate(); // For navigation
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products for the given category
    axios
      .get(`http://localhost:5000/products/category/${categoryTitle}`)
      .then((response) => {
        console.log('Fetched products:', response.data); // Debugging logs
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products for category:', error);
        setLoading(false);
      });
  }, [categoryTitle]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleAddToCart = async (product, quantity) => {
    // Check if the user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please log in to add products to the cart.');
      navigate('/login'); // Redirect to login page
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        userId: user._id,
        productId: product._id,
        productName: product.productname,
        productPrice: product.productprice,
        productSalePrice: product.productsaleprice,
        productImage: product.productfile,
        quantity,
      });
      
      // Confirm popup window
    if (window.confirm("Product added to cart successfully!")) {
      window.location.reload();
    }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const handleQuantityChange = (productId, delta) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? { ...product, quantity: Math.max((product.quantity || 1) + delta, 1) }
          : product
      )
    );
  };

  return (
    <div>
      <Header />
      <div className="category-section-one">
        <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1>{categoryTitle}</h1>
          </div>
        </div>
        </div>
      </div>

      <div className="category-section-two">
      <div className="container">
        <div className="row">

          <div className="product-area">
          {products.length > 0 &&
            products.map((product) => (
            <div className="product-details" key={product._id}>
              <div className="product-img-box">
              <img
                    src={`http://localhost:5000/uploads/${product.productfile}`}
                    alt={product.productname}
                    className="card-img-top" 
                    />
              </div>
              <div className="product-content">

              <h5 className="card-title">{product.productname}</h5>
                    <p className="card-text">Price : <span>₹{product.productprice}</span></p>
                    {/* <p className="card-text">Sale Price: ₹{product.productsaleprice}</p> */}
                    <div className="input-group mb-3">
                      <button
                        className="input-group-text"
                        onClick={() => handleQuantityChange(product._id, -1)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control"
                        value={product.quantity || 1}
                        readOnly
                      />
                      <button
                        className="input-group-text"
                        onClick={() => handleQuantityChange(product._id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-primary btn-add-to-cart"
                      onClick={() => handleAddToCart(product, product.quantity || 1)}
                    >
                      Add to Cart
                    </button>

              </div>
                  
                    
              </div>
            ))}
            
          </div>


          
        </div>
      </div>
      </div>
      
      <Footer/>
    </div>
  );
};

export default CategoryPage;
