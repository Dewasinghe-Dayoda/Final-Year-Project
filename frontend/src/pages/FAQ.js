import React from "react";
import "../styles/FAQ.css";
import faqIcon from "../assets/faq-icon.png"; // Import the FAQ icon

const FAQ = () => {
  const faqs = [
    {
      question: "How accurate is SkinProScan?",
      answer: "SkinProScan uses advanced AI technology with an accuracy rate of over 90% for common skin conditions.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption to protect your data.",
    },
    {
      question: "Can I use SkinProScan for children?",
      answer: "Yes, SkinProScan is safe for all ages.",
    },
  ];

  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-text">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
            <div className="faq-icon">
              <img src={faqIcon} alt="FAQ Icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
