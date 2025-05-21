import React from "react";
import "../styles/About.css";
import aboutImage from "../assets/about-hero.avif"; 

const About = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About SkinProScan</h1>
        <p>Your trusted partner in skin health.</p>
      </section>

      <section className="about-content">
        <div className="about-image">
          <img src={aboutImage} alt="About SkinProScan" />
        </div>
        <div className="about-text">
          <h2>Our Mission</h2>
          <p>
            At SkinProScan, we are committed to revolutionizing skin health by providing accurate, AI-powered diagnoses for bacterial and fungal skin conditions. Our mission is to make skin health accessible to everyone, empowering users to take control of their well-being.
          </p>
          <h2>Our Technology</h2>
          <p>
            SkinProScan uses advanced convolutional neural networks (CNNs) to analyze skin images and detect conditions like cellulitis, impetigo, athlete's foot, and ringworm. Our AI is trained on thousands of images to ensure high accuracy and reliability.
          </p>
          <h2>Our Team</h2>
          <p>
            Our team consists of dermatologists, data scientists, and software engineers who are passionate about improving skin health through technology. We work tirelessly to ensure our platform is user-friendly, secure, and effective.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
