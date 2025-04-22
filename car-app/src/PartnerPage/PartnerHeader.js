import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PartnerHeader = () => {
  return (
    <div>
            <header className="header">
              <div className="navbar">
                <div className="main-logo">
                  <Link to="/">logo</Link>
                </div>
                <ul className="nav">
                    <li>
                       <Link to="/">Booking Service</Link>
                    </li>
                    <li>
                       <Link to="/">About Us</Link>
                    </li>
                </ul>
              </div>
            </header>
    </div>
  )
}

export default PartnerHeader