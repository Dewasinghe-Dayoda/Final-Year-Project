import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/DiseaseDetails.css';

const Cellulitis = () => {
  return (
    <div className="disease-detail-container">
      <div className="disease-header">
        <h1 className="disease-title">Cellulitis</h1>
        <p className="disease-subtitle">A bacterial skin infection of the lower dermis and subcutaneous tissue</p>
      </div>
      <div className="disease-image-container">
        <img src="/images/cellulitis.jpg" alt="Cellulitis" className="disease-image" />
      </div>
      <div className="disease-section">
        <h2>Overview</h2>
        <p>Cellulitis is a common bacterial skin infection of the lower dermis and subcutaneous tissue. It results in a localized area of red, painful, swollen skin, and systemic symptoms. Left untreated, cellulitis can be life-threatening.</p>
      </div>

      <div className="disease-image-gallery">
        <div className="gallery-item">
          <img src="/images/cellulitis1.jpg" alt="Cellulitis of the left leg" className="disease-image" />
          <p className="image-caption">Cellulitis of the left leg</p>
        </div>
        <div className="gallery-item">
          <img src="/images/cellulitis2.jpg" alt="Close-up of cellulitis rash" className="disease-image" />
          <p className="image-caption">Close-up of cellulitis rash</p>
        </div>
        <div className="gallery-item">
          <img src="/images/cellulitis3.jpeg" alt="Cellulitis with marked area" className="disease-image" />
          <p className="image-caption">Cellulitis with marked area</p>
        </div>
      </div>

      <div className="disease-section">
        <h2>Who gets cellulitis?</h2>
        <p>Cellulitis affects people of all ages and races. Risk factors include:</p>
        <ul>
          <li>Previous episode(s) of cellulitis</li>
          <li>Fissuring of toes or heels (e.g., athlete's foot, cracked heels)</li>
          <li>Venous disease (e.g., gravitational eczema, leg ulceration, lymphoedema)</li>
          <li>Current or prior injury (trauma, surgical wounds, IV drug use)</li>
          <li>Immunodeficiency (e.g., HIV)</li>
          <li>Immune suppressive medications</li>
          <li>Diabetes, chronic kidney disease, chronic liver disease</li>
          <li>Obesity, pregnancy, alcoholism</li>
        </ul>
      </div>

      <div className="disease-section">
        <h2>Causes</h2>
        <p>The most common bacteria causing cellulitis are:</p>
        <ul>
          <li><strong>Streptococcus pyogenes</strong> (two-thirds of cases)</li>
          <li><strong>Staphylococcus aureus</strong> (one third)</li>
        </ul>
        <p>Rare causes include Pseudomonas aeruginosa (puncture wounds), Haemophilus influenzae (children with facial cellulitis), and others from animal bites or water exposure.</p>
      </div>

      <div className="disease-section">
        <h2>Clinical Features</h2>
        <ul>
          <li>Usually unilateral (one side)</li>
          <li>Often begins with systemic symptoms (fever, chills)</li>
          <li>Localized area of painful, red, swollen skin</li>
          <li>Dimpled skin (peau d'orange)</li>
          <li>Warmth, blistering, erosions, abscess formation</li>
          <li>May have associated lymphangitis (red line tracking to lymph nodes)</li>
        </ul>
      </div>

      <div className="disease-section">
        <h2>Treatment</h2>
        <h3>Uncomplicated cellulitis:</h3>
        <ul>
          <li>Oral antibiotics for 5-10 days (penicillin-based often first choice)</li>
          <li>Analgesia for pain</li>
          <li>Adequate fluid intake</li>
          <li>Management of co-existing skin conditions</li>
        </ul>

        <h3>Severe cellulitis:</h3>
        <ul>
          <li>Intravenous antibiotics</li>
          <li>Fluids and oxygen if needed</li>
          <li>May require hospitalization</li>
        </ul>
      </div>

      <div className="back-button-container">
        <Link to="/awareness" className="back-button">Back to Awareness Page</Link>
      </div>
      </div>
  );
};

export default Cellulitis;