import React from 'react';
import PartnerHeader from './PartnerHeader';
import { Link } from 'react-router-dom';
import Footer from '../Footer';

const Partnerpage = () => {
  return (
    <div>
    <PartnerHeader />
    <div className="section-partner-page-one">
        <div className="container">
            <div className="row">
                <div className="col-md-8">
                   <h2>
                   Earn More. Earn Respect.<br></br> Safety Ensured.
                   </h2>
                   <p>
                   Join 40,000+ partners across India, USA, Singapore, UAE and many more
                   </p>
                   <Link to="/servicepartners" className="btn btn-primary btn-join-us">Join Us</Link>
                </div>
                <div className="col-md-4">
                    <img src="assets/images/partnerplumber.png" />
                </div>
            </div>
        </div>
    </div>

    <div className="section-partner-page-two">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h2>
                    Join our company to change your life
                    </h2>
                    <p>
                        Our company is an app-based marketplace that empowers professionals like you to become your own boss
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="partner-page-box">
                        <h3>
                        <span>40,000+</span>
                        Partners already on board
                        </h3>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="partner-page-box">
                        <h3>
                        <span>₹1547Cr</span>
                        Paid out to partners in 2024
                        </h3>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="partner-page-box">
                        <h3>
                        <span>1,250,000+</span>
                        Services delivered each month
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Footer />

    </div>
  )
}

export default Partnerpage