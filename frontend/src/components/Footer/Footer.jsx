import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'; 

const Footer = () => {
  return (
    <div className='footer' id="footer">
        <div className="footer-content">

            <div className="footer-content-left">
                <img src={assets.logo} alt="" />
                <p>Welcome to MHP – your trusted partner for high-quality products and services. At MHP, we prioritize quality, reliability, and your trust. Thank you for choosing us – where your satisfaction is our mission.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon}alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            
            </div>

            <div className="footer-content-center">
            <h2>Company</h2>
            <ul>
              <li>Home</li>
              <li>About Us</li>
              <li>Delivery</li>
              <li>Privacy Policy</li>
            </ul>
            </div>

            <div className="footer-content-right">
              <h2>Get in touch </h2>
              <ul>
                <li>9000180154</li>
                <li>contact@mhp.com</li>
              </ul>
            
            </div>
            
        </div>
        <hr />
        <p className='footer-copyright'>Copyright 2025 @Mhp.com - All Rights Reserved</p>

    </div>
  )
}

export default Footer
