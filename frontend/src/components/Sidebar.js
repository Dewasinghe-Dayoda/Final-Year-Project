//If you want a sidebar for navigation inside the User Dashboard.
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Import CSS

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
