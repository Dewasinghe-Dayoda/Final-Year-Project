import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/DiseaseDetails.css';

const AthletesFoot = () => {
  return (
    <div className="disease-detail-container">
      <div className="disease-header">
        <h1 className="disease-title">Athlete's Foot</h1>
        <p className="disease-subtitle">A fungal infection of the foot (Tinea Pedis)</p>
      </div>
      <div className="disease-image-container">
        <img src="/images/athlete's foot.jpeg" alt="athletsfoot" className="disease-image" />
      </div>
      <div className="disease-section">
        <h2>Overview</h2>
        <p>Athlete's foot (tinea pedis) is a fungal infection that most often results in peeling skin and fissuring between the toes. The cleft between the fourth and fifth toes is most frequently affected.</p>
      </div>

      <div className="disease-section">
        <h2>Causes</h2>
        <p>Most commonly caused by:</p>
        <ul>
          <li>Trichophyton rubrum</li>
          <li>Trichophyton interdigitale</li>
          <li>Epidermophyton floccosum</li>
        </ul>
        <p>Risk factors include wearing occlusive footwear, excessive sweating, poor foot hygiene, and exposure to contaminated surfaces.</p>
      </div>

      <div className="disease-section">
        <h2>Clinical Features</h2>
        <ul>
          <li>Peeling, scaling skin between toes</li>
          <li>Redness and itching</li>
          <li>Burning or stinging sensation</li>
          <li>Fissures or cracks in the skin</li>
          <li>Unpleasant odor</li>
          <li>In severe cases: blistering, maceration, secondary bacterial infection</li>
        </ul>
      </div>
      {/*change below div tag's position accordily.*/}
      <div className="disease-image-gallery">
        <div className="gallery-item">
          <img src="/images/athletesfoot1.jpg" alt="Athlete's foot between toes" className="disease-image" />
          <p className="image-caption">Athlete's foot between toes</p>
        </div>
        <div className="gallery-item">
          <img src="/images/athletesfoot2.jpg" alt="Advanced athlete's foot" className="disease-image" />
          <p className="image-caption">Advanced athlete's foot</p>
        </div>
        <div className="gallery-item">
          <img src="/images/athletesfoot3.jpg" alt="Severe athlete's foot" className="disease-image" />
          <p className="image-caption">Severe athlete's foot</p>
        </div>
      </div>
      <div className="disease-section">
        <h2>Diagnosis</h2>
        <ul>
          <li>Clinical examination</li>
          <li>Potassium hydroxide (KOH) preparation of skin scrapings</li>
          <li>Fungal culture if diagnosis is uncertain</li>
          <li>Wood's lamp examination (some fungi fluoresce)</li>
        </ul>
      </div>

      <div className="disease-section">
        <h2>Treatment</h2>
        <h3>General measures:</h3>
        <ul>
          <li>Keep feet clean and dry</li>
          <li>Change socks frequently</li>
          <li>Wear breathable footwear</li>
          <li>Use antifungal powder</li>
        </ul>

        <h3>Topical antifungals:</h3>
        <ul>
          <li>Terbinafine cream (1-2 weeks)</li>
          <li>Clotrimazole or miconazole cream (2-4 weeks)</li>
          <li>For severe cases: Whitfield's ointment (keratolytic)</li>
        </ul>

        <h3>Oral antifungals (for severe or resistant cases):</h3>
        <ul>
          <li>Terbinafine (250mg daily for 2 weeks)</li>
          <li>Itraconazole (200mg daily for 1 week)</li>
        </ul>
      </div>

      <div className="disease-section">
        <h2>Prevention</h2>
        <ul>
          <li>Dry feet thoroughly after bathing</li>
          <li>Wear flip-flops in public showers</li>
          <li>Alternate shoes to allow them to dry</li>
          <li>Use antifungal powder if prone to infection</li>
          <li>Treat all affected areas simultaneously</li>
        </ul>
      </div>

      <div className="back-button-container">
        <Link to="/awareness" className="back-button">Back to Awareness Page</Link>
      </div>
       </div>
  );
};

export default AthletesFoot;