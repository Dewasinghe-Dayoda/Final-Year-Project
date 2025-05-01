import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">SkinProScan</span>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Home</NavLink></li>
        <li><NavLink to="/quickcheck" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Quick Check</NavLink></li>
        <li><NavLink to="/awareness" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Explore Conditions</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>About</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Contact</NavLink></li>
        <li><NavLink to="/FAQ" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>FAQ</NavLink></li>
        <li><NavLink to="/UserProfile" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Profile</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
