// 📌 Purpose: Explain data handling, AI limitations, and user rights.
// 📌 Location: src/pages/PrivacyPolicy.js

import React from "react";
import "../styles/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      <p>Last updated: October 2025</p>
      <section>
        <h2>Introduction</h2>
        <p>
          At SkinProScan, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your information.
        </p>
      </section>
      <section>
        <h2>Data Collection</h2>
        <p>
          We collect information such as your name, email, and skin images to provide our services. This data is stored securely and used only for diagnostic purposes.
        </p>
      </section>
      <section>
        <h2>Data Usage</h2>
        <p>
          Your data is used to improve our AI models and provide you with accurate diagnoses. We do not share your data with third parties without your consent.
        </p>
      </section>
      <section>
        <h2>Data Security</h2>
        <p>
          We use industry-standard encryption and security measures to protect your data from unauthorized access.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
