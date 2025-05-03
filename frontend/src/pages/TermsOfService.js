import React from "react";
import "../styles/TermsOfService.css";

const TermsOfService = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1>Terms of Service</h1>
        <p>Last updated: October 2024</p>
        <section>
          <h2>Introduction</h2>
          <p>
            By using SkinProScan, you agree to these terms and conditions. Please read them carefully.
          </p>
        </section>
        <section>
          <h2>User Responsibilities</h2>
          <p>
            You are responsible for providing accurate information and using the platform for its intended purpose.
          </p>
        </section>
        <section>
          <h2>Limitations</h2>
          <p>
            SkinProScan is not a substitute for professional medical advice. Always consult a healthcare provider for serious conditions.
          </p>
        </section>
        <section>
          <h2>Termination</h2>
          <p>
            We reserve the right to terminate your access if you violate these terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
