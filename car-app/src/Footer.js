import React from 'react';
import { FaTwitterSquare } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";

const Footer = () => {
  return (
    <div>

<div className="footer">
                   
                   <div className="footer-top">
                       <div className="foot-top-box">
                           <div className="main-logo">
                               <a href="#">logo</a>
                           </div>
                       </div>
                       <div className="foot-top-box">
                           <h4>company</h4>
                           <ul>
                               <li>
                                   <a href="#">About us</a>
                               </li>
                               <li>
                                   <a href="#">Terms & conditions</a>
                               </li>
                               <li>
                                   <a href="#">Privacy policy</a>
                               </li>
                           </ul>
                       </div>
       
                       <div className="foot-top-box">
                           <h4>For customers</h4>
                           <ul>
                               <li>
                                   <a href="#">Blog </a>
                               </li>
                               <li>
                                   <a href="#">Contact us</a>
                               </li>
                               <li>
                                   <a href="#">Careers</a>
                               </li>
                           </ul>
                       </div>
       
                       <div className="foot-top-box">
                           <h4>Social links</h4>
                           <ul className="social-link">
                               <li>
                                   <a href="#"><FaTwitterSquare /> </a>
                               </li>
                               <li>
                                   <a href="#"><FaFacebookSquare /></a>
                               </li>
                               <li>
                                   <a href="#"><FaInstagramSquare /></a>
                               </li>
                               <li>
                                   <a href="#"><FaLinkedin /></a>
                               </li>
                           </ul>
                       </div>
                   </div>
       
       
                   <div className="footer-bottom">
                       <p>© Copyright 2024 <a href="https://metiermedia.com">Metier Media</a>. All rights reserved.</p>
                   </div>

               </div>

    </div>
  )
}

export default Footer