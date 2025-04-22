import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/DiseaseDetails.css';

const Impetigo = () => {
  return (
    <div className="disease-detail-container">
      <div className="disease-header">
        <h1 className="disease-title">Impetigo</h1>
        <p className="disease-subtitle">A highly contagious bacterial skin infection</p>
      </div>
      <div className="disease-image-container">
        <img src="/images/impetigo.jpg" alt="Cellulitis" className="disease-image" />
      </div>
      <div className="disease-section">
        <h2>Overview</h2>
        <p>Impetigo is a common, superficial, highly contagious bacterial skin infection characterized by pustules and honey-colored crusted erosions. It affects the superficial layers of the epidermis and is typically caused by Staphylococcus aureus and Streptococcus pyogenes.</p>
      </div>

      <div className="disease-section">
        <h2>Who gets impetigo?</h2>
        <p>Impetigo is most common in young children but can occur at any age. Risk factors include:</p>
        <ul>
          <li>Skin conditions like atopic dermatitis, contact dermatitis, scabies, or chickenpox</li>
          <li>Skin trauma (lacerations, insect bites, burns, abrasions)</li>
          <li>Immunosuppression</li>
          <li>Warm, humid climate</li>
          <li>Poor hygiene</li>
          <li>Crowded environments</li>
        </ul>
      </div>

      <div className="disease-section">
        <h2>Clinical Features</h2>
        <h3>Non-bullous impetigo:</h3>
        <ul>
          <li>Most common form (about 70% of cases)</li>
          <li>Begins as red macules that evolve into vesicles or pustules</li>
          <li>Ruptures to form honey-colored crusts</li>
          <li>Often on face (around nose and mouth) or extremities</li>
          <li>Can spread rapidly via autoinoculation</li>
        </ul>

        <h3>Bullous impetigo:</h3>
        <ul>
          <li>Caused by S. aureus producing exfoliative toxins</li>
          <li>Large, fragile bullae that rupture easily</li>
          <li>Leaves collarette of scale</li>
          <li>Often on trunk, buttocks, or skin folds</li>
          <li>More likely to have systemic symptoms</li>
        </ul>
      </div>
      {/*change below div tag's position accordily.*/}
      <div className="disease-image-gallery">
        <div className="gallery-item">
          <img src="/images/impetigo1.jpg" alt="Honey-coloured crusts on the chin in impetigo" className="disease-image" />
          <p className="image-caption">Honey-coloured crusts on the chin</p>
        </div>
        <div className="gallery-item">
          <img src="/images/impetigo2.jpg" alt="Kissing lesions in impetigo" className="disease-image" />
          <p className="image-caption">Kissing lesions in impetigo</p>
        </div>
        <div className="gallery-item">
          <img src="/images/impetigo3.jpg" alt="Perioral honey-coloured crusts" className="disease-image" />
          <p className="image-caption">Perioral honey-coloured crusts</p>
        </div>
        <div className="gallery-item">
          <img src="/images/impetigo4.jpg" alt="Widespread bullous impetigo" className="disease-image" />
          <p className="image-caption">Widespread bullous impetigo</p>
        </div>
        <div className="gallery-item">
          <img src="/images/impetigo5.jpg" alt="Blister and erosions in bullous impetigo" className="disease-image" />
          <p className="image-caption">Blister and erosions in bullous impetigo</p>
        </div>
      </div>
      <div className="disease-section">
        <h2>Treatment</h2>
        <h3>General measures:</h3>
        <ul>
          <li>Gentle cleansing to remove crusts</li>
          <li>Good hand hygiene</li>
          <li>Keep nails short</li>
          <li>Cover lesions to prevent spread</li>
        </ul>

        <h3>Topical treatment:</h3>
        <ul>
          <li>For localized infection: Mupirocin or retapamulin ointment</li>
          <li>Apply 2-3 times daily for 5-7 days</li>
        </ul>

        <h3>Oral antibiotics:</h3>
        <ul>
          <li>For extensive or bullous impetigo</li>
          <li>First-line: Dicloxacillin or cephalexin</li>
          <li>For MRSA: Clindamycin or doxycycline</li>
          <li>Duration: 7-10 days</li>
        </ul>
      </div>

      <div className="disease-section">
        <h2>Prevention</h2>
        <ul>
          <li>Avoid close contact with infected individuals</li>
          <li>Don't share personal items (towels, clothing)</li>
          <li>Treat underlying skin conditions</li>
          <li>Children should stay home until 24 hours after starting treatment</li>
        </ul>
      </div>

      <div className="back-button-container">
        <Link to="/awareness" className="back-button">Back to Awareness Page</Link>
      </div>
      </div>
  );
};

export default Impetigo;