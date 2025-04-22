import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import featureImage1 from "../assets/feature_1.jpg";
import featureImage2 from "../assets/feature_2.jpg";
import featureImage3 from "../assets/feature_3.jpg";

const Home = () => {
  const navigate = useNavigate(); 

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Welcome to SkinProScan</h1>
        <p className="hero-subtitle">AI-Based Detection of Bacterial and Fungal Skin Diseases</p>
        <p className="hero-description">
          Your first step to diagnosing and treating skin conditions with the power of AI. 
          We help you identify conditions like</p>
        <p className="hero-description"> cellulitis, impetigo, athlete's foot, and ringworm using advanced image processing technology.
        </p>
        <button 
          className="cta-button" 
          onClick={() => navigate('/QuickCheck')} 
        >
          Start Your Skin Check
        </button>
      </section>

      {/* Rest of your existing Home.js code remains the same */}
      <section className="features-section">
        <h2 className="section-title">How It Works</h2>
        <div className="features-container">
          <div className="feature">
          <img src={featureImage1} alt="Step 1" className="feature-image" />
            <h3>Step 1: Upload Your Image</h3>
            <p>
              Simply upload an image of the skin condition you suspect. Make sure the image is clear and well-lit for best results.
            </p>
          </div>
          <div className="feature">
          <img src={featureImage2} alt="Step 2" className="feature-image" />
            <h3>Step 2: AI-Powered Analysis</h3>
            <p>
              Our AI-powered system analyzes the image using convolutional neural networks (CNNs) to detect specific bacterial and fungal conditions.
            </p>
          </div>
          <div className="feature">
          <img src={featureImage3} alt="Step 3" className="feature-image" />
            <h3>Step 3: Get Your Results Now</h3>
            <p>
              Once the analysis is complete, you'll receive a confidence score for each condition along with suggested actions for treatment.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2 className="section-title">Why Choose SkinProScan?</h2>
        <div className="about-container">
          <p>
            SkinProScan leverages state-of-the-art artificial intelligence to provide you with accurate and fast diagnoses of common bacterial and fungal skin conditions.
            Our mission is to make skin health diagnosis accessible to everyone, empowering you to take charge of your skin health.
          </p>
          <p>
            Trusted by dermatologists and used by thousands of users, SkinProScan offers a reliable, non-invasive way to assess your skin condition from the comfort of your home.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <h2 className="section-title">Get In Touch</h2>
        <p>
          Have questions or need assistance? Our team is here to help! Contact us at <a href="mailto:support@skinpro.com">support@skinpro.com</a>.
        </p>
        <p>
          Have questions or need assistance? Our team is here to help! Call us at <strong>+94 123 456 789</strong>.
        </p>
      </section>
    </div>
  );
};

export default Home;