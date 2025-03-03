import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css";
import logo from "../assets/SkinProScan_logo1.png"; // Adjust the path to your logo

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Side - Logo and Name */}
        <div className="footer-logo">
          <img src={logo} alt="SkinPro Logo" />
          <h2>SkinProScan</h2>
        </div>

        {/* Center - Quick Links */}
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/quickcheck">Quick Check</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
        </div>

        {/* Right Side - Contact & Social Media */}
        <div className="footer-contact">
          <p>Email: support@skinpro.com</p>
          <p>Phone: +94 123 456 789</p>
          <p>Address: NSBM Green University, Sri Lanka</p>

          {/* Social Media Links */}
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SkinPro. All Rights Reserved.</p>
        <p>Disclaimer: This AI tool is not a substitute for professional medical advice.</p>
      </div>
    </footer>
  );
};

export default Footer;
