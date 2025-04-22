import React from 'react';
import { Link } from 'react-router-dom';
import './DiseaseCard.css';

const DiseaseCard = ({ disease }) => {
  return (
    <div className="disease-card">
      <div className="disease-image-container">
        <img 
          src={`/images/${disease.imageName}`} 
          alt={disease.name} 
          className="disease-image"
        />
      </div>
      <div className="disease-content">
        <h3>{disease.name}</h3>
        <p className="disease-description">{disease.shortDescription}</p>
        <div className="disease-features">
          <h4>Key Features:</h4>
          <ul>
            {disease.keyFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="disease-links">
          <Link 
            to={`/disease/${disease.id}`}
            className="learn-more-btn"
          >
            Learn More
          </Link>
          {disease.videoLink && (
            <a 
              href={disease.videoLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="video-link"
            >
              Watch Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseCard;