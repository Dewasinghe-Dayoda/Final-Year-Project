import React from "react";
import "../styles/Contact.css";


const Contact = () => {
  return (
    <div className="contact-container">
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>We're here to help! Reach out to us for any questions or concerns.</p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>Email: <a href="mailto:support@skinpro.com">support@skinpro.com</a></p>
          <p>Phone: +94 123 456 789</p>
          <p>Address: 123 SkinPro Lane, Health City, Country</p>
        </div>
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;