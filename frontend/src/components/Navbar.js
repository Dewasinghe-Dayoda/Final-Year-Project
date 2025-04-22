import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; 
//import logo from "../assets/SkinProScan_logo1.png"; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">SkinProScan</span>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/awareness">Explore Conditions</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/quickcheck">Quick Check</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/UserProfile">Profile</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
