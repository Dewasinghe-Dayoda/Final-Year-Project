import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
        
        {/* Hamburger Dropdown */}
        <li className="hamburger-wrapper">
          <button className="hamburger-btn" onClick={toggleDropdown}>☰</button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <NavLink to="/AppointmentHistory" className="dropdown-link" onClick={toggleDropdown}>Appointment History</NavLink>
              <NavLink to="/Notifications" className="dropdown-link" onClick={toggleDropdown}>Notifications</NavLink>
              <NavLink to="/UserProfile" className="dropdown-link" onClick={toggleDropdown}>Logout</NavLink>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
