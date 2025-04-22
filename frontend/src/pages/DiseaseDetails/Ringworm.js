import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/DiseaseDetails.css';

const Ringworm = () => {
  return (
    <div className="disease-detail-container">
      <div className="disease-header">
        <h1 className="disease-title">Ringworm (Tinea Corporis)</h1>
        <p className="disease-subtitle">A superficial fungal infection of the skin</p>
      </div>
      <div className="disease-image-container">
        <img src="/images/ringworm.jpg" alt="athletsfoot" className="disease-image" />
      </div>
      <div className="disease-section">
        <h2>Overview</h2>
        <p>Ringworm (tinea corporis) is a superficial fungal infection that can affect any part of the body (excluding hands, feet, scalp, face, beard, groin, and nails). It presents with characteristic ring-shaped lesions with a raised scaly border and central clearing.</p>
      </div>

      <div className="disease-section">
        <h2>Causes</h2>
        <p>Most commonly caused by dermatophyte fungi:</p>
        <ul>
          <li>Trichophyton rubrum (most common worldwide)</li>
          <li>Trichophyton interdigitale</li>
          <li>Microsporum canis (from cats and dogs)</li>
          <li>Other species from animals or soil</li>
        </ul>
      </div>

      <div className="disease-section">
        <h2>Clinical Features</h2>
        <ul>
          <li>Circular or oval red patches with raised scaly border</li>
          <li>Central clearing gives ring-like appearance</li>
          <li>Itching is common</li>
          <li>May have pustules or vesicles at active border</li>
          <li>Lesions may coalesce to form polycyclic patterns</li>
          <li>Usually asymmetrical distribution</li>
        </ul>

        <h3>Variants:</h3>
        <ul>
          <li><strong>Kerion:</strong> Inflammatory, boggy plaque with pustules</li>
          <li><strong>Majocchi granuloma:</strong> Perifollicular papules/pustules</li>
          <li><strong>Tinea incognito:</strong> Atypical appearance due to steroid use</li>
          <li><strong>Bullous tinea:</strong> With vesicles or blisters</li>
        </ul>
      </div>
      {/*change below div tag's position accordily.*/}
      <div className="disease-image-gallery">
        <div className="gallery-item">
          <img src="/images/ringworm1.jpg" alt="Typical annular lesions of ringworm" className="disease-image" />
          <p className="image-caption">Typical annular lesions</p>
        </div>
        <div className="gallery-item">
          <img src="/images/ringworm2.jpg" alt="Close-up of ringworm lesion" className="disease-image" />
          <p className="image-caption">Close-up of lesion</p>
        </div>
        <div className="gallery-item">
          <img src="/images/ringworm3.jpg" alt="Multiple ringworm lesions" className="disease-image" />
          <p className="image-caption">Multiple lesions</p>
        </div>
        <div className="gallery-item">
          <img src="/images/ringworm4.jpg" alt="Inflammatory ringworm (kerion)" className="disease-image" />
          <p className="image-caption">Inflammatory ringworm (kerion)</p>
        </div>
        <div className="gallery-item">
          <img src="/images/ringworm5.jpg" alt="Majocchi granuloma" className="disease-image" />
          <p className="image-caption">Majocchi granuloma</p>
        </div>
        <div className="gallery-item">
          <img src="/images/ringworm6.jpg" alt="Tinea incognito" className="disease-image" />
          <p className="image-caption">Tinea incognito</p>
        </div>
      </div>
      <div className="disease-section">
        <h2>Diagnosis</h2>
        <ul>
          <li>Clinical examination</li>
          <li>Skin scrapings for KOH microscopy</li>
          <li>Fungal culture if diagnosis uncertain</li>
          <li>Wood's lamp examination (some species fluoresce)</li>
          <li>Skin biopsy in atypical cases</li>
        </ul>
      </div>

      <div className="disease-section">
        <h2>Treatment</h2>
        <h3>Topical antifungals (for localized infection):</h3>
        <ul>
          <li>Terbinafine cream (once or twice daily for 1-2 weeks)</li>
          <li>Clotrimazole or miconazole cream (twice daily for 2-4 weeks)</li>
          <li>Apply to lesion and 2cm beyond border</li>
          <li>Continue for 1 week after resolution</li>
        </ul>

        <h3>Oral antifungals (for extensive or resistant cases):</h3>
        <ul>
          <li>Terbinafine (250mg daily for 2-4 weeks)</li>
          <li>Itraconazole (200mg daily for 1 week)</li>
          <li>Griseofulvin (for children)</li>
        </ul>
      </div>

      <div className="disease-section">
        <h2>Prevention</h2>
        <ul>
          <li>Keep skin clean and dry</li>
          <li>Avoid sharing personal items</li>
          <li>Treat pets if they are the source</li>
          <li>Wear protective clothing in high-risk environments</li>
          <li>Treat concurrent tinea infections (e.g., athlete's foot)</li>
        </ul>
      </div>

      <div className="back-button-container">
        <Link to="/awareness" className="back-button">Back to Awareness Page</Link>
      </div>
      </div>
  );
};

export default Ringworm;