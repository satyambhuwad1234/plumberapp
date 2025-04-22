import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import OwlCarousel from 'react-owl-carousel';



const Home = () => {

    const [banners, setBanners] = useState([]); // State to hold banner data
    const [categories, setCategories] = useState([]);
  

  // Fetch banner data when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:5000/banners')  // Your API endpoint
      .then((response) => {
        setBanners(response.data);  // Set the fetched banners into state
      })
      .catch((error) => {
        console.error('Error fetching banners:', error);
      });
  }, []);  // Empty dependency array to run once when component mounts


    // Fetch categories data when the component mounts
    useEffect(() => {
      axios
        .get('http://localhost:5000/categories')  // Your API endpoint
        .then((response) => {
          setCategories(response.data);  // Set the fetched categories into state
        })
        .catch((error) => {
          console.error('Error fetching categories:', error);
        });
    }, []);  // Empty dependency array to run once when component mounts


    const options = {
      loop: true,
      margin: 10,
      nav: true,
      dots: true,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      responsive: {
        0: { items: 1 },
        600: { items: 1 },
        1000: { items: 1 },
      },
    };


  return (
    <div>
        <Header/>
        {/* {banners.map((banner, index) => (

        <div className="home-section-one" key={index}>
            <div className="home-sec-one-left">
                <h1>{banner.bannertitle}</h1>
            </div>
            <div className="home-sec-one-right">
                <img src={`http://localhost:5000/uploads/${banner.bannerfile}`} alt={banner.bannertitle}  />
            </div>
        </div>

        ))} */}

<OwlCarousel className="owl-theme" {...options}>
        {banners.map((banner, index) => (
          <div className="item" key={index}>
            <div className="home-section-one">
            <div className="home-sec-one-left">
                <h1>{banner.bannertitle}</h1>
                <a href="#" className="btn-view-more">view more</a>
            </div>
            <div className="home-sec-one-right">
                <img src={`http://localhost:5000/uploads/${banner.bannerfile}`} alt={banner.bannertitle}  />
            </div>
        </div>
          </div>
        ))}
      </OwlCarousel>


<div className="home-section-two">

{categories.map((category, index) => (
          <Link
            className="home-service-box"
            aria-current="page"
            to={`/category/${category.categorytitle}`} // Dynamic route
            key={index}
          >
            <div className="service-icon">
              <img
                src={`http://localhost:5000/uploads/${category.categoryfile}`}
                alt={category.categorytitle}
              />
            </div>
            <div className="service-title">
              <h4>{category.categorytitle} <span style={{color:"#000"}}><i class="bi bi-arrow-right-circle"></i></span></h4>
            </div>
          </Link>
        ))}

</div>


<div className="home-section-three">
  <div className="container-fluid">
    <div className="row">
      <div className="col-md-12">
        <div className="home-sec-three-top">
          <div className="home-sec-three-top-left">
            <img src="assets/images/home-book-visit.png" />
          </div>
          <div className="home-sec-three-top-right">
            <h2>
            "Got a Plumbing Problem? We’ve Got You Covered!"
            </h2>
            <ul>
              <li>
               <span style={{color:'#45b0d2'}}><i class="bi bi-droplet-fill"></i> </span> Expert Repairs for Every Plumbing Need
              </li>
              <li>
                <span style={{color:'#000'}}><i class="bi bi-tools"></i> </span> Residential & Commercial Services
              </li>
              <li>
                <span style={{color:"#a52a2a"}}><i class="bi bi-alarm-fill"></i></span> Quick Response, 24/7 Availability
              </li>
            </ul>
            <Link to="/category/Book%20a%20Consultation" className="book-a-visit">Book Your Visit Now</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div className="home-section-four">
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <h2>our promises</h2>
      </div>
    </div>
    <div className="row">
      <div className="col-md-4">
        <div className="promise-icon">
          <i class="bi bi-tools"></i>
        </div>
         <h4>Expert Service, Every Time</h4>
         <p>
            Our licensed and experienced plumbers ensure top-quality work.
         </p>
      </div>

      <div className="col-md-4">
         <div className="promise-icon">
            <i class="bi bi-credit-card-2-front-fill"></i>
         </div>
         <h4>Transparent Pricing</h4>
         <p>
            No hidden costs—what we quote is what you pay.
         </p>
      </div>

      <div className="col-md-4">
         <div className="promise-icon">
            <i class="bi bi-hand-thumbs-up-fill"></i>
         </div>
         <h4>Customer Satisfaction Guaranteed</h4>
         <p>
            We’re not happy until you’re completely satisfied.
         </p>
      </div>

    </div>
  </div>
</div>


<Footer/>
        
    </div>
  )
}

export default Home