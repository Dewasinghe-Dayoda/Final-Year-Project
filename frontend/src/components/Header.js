import React from "react";
import "./Header.css"; // Import CSS

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Welcome to SkinProScan</h1>
      <p className="header-subtitle">AI-Based Detection of Bacterial and Fungal Skin Diseases</p>
    </header>
  );
};

export default Header;
