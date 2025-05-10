import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClinics } from '../api';
import '../styles/AppointmentPage.css';

const AppointmentPage = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getClinics('Colombo', 10);
        
        if (response.error) {
          throw new Error(response.error);
        }

        if (!response.data) {
          throw new Error("No clinics data received");
        }

        setClinics(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("API Error:", error);
        setError(error.message || "Failed to load clinics. Please try again.");
        setClinics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  const handleClinicClick = (clinicId) => {
    if (!clinicId) {
      console.error("Invalid clinic ID");
      return;
    }
    navigate(`/clinics/${clinicId}`);
  };

  return (
    <div className="appointment-container">
      <h2>Dermatology Centers in Colombo</h2>
      
      {loading && <p className="loading-message">Loading clinics...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="clinics-grid">
        {clinics.map(clinic => (
          <div key={clinic._id} className="clinic-card">
            <div className="clinic-image">
              <img 
                src={`/images/clinics/${clinic.images?.[0] || 'default-clinic.jpg'}`} 
                alt={clinic.name} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/clinics/default-clinic.jpg';
                }}
              />
            </div>
            
            <div className="clinic-info">
              <h3>{clinic.name}</h3>
              <p className="address">{clinic.address}</p>
              <p className="opening-hours">{clinic.openingHours}</p>
              
              <div className="contact-info">
                <p><strong>Phone:</strong> {clinic.phone}</p>
                {clinic.email && <p><strong>Email:</strong> {clinic.email}</p>}
              </div>
              
              <div className="services">
                <h4>Services:</h4>
                <ul>
                  {clinic.services?.slice(0, 3).map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
              
              <div className="clinic-actions">
                <button 
                  onClick={() => handleClinicClick(clinic._id)}
                  className="details-btn"
                >
                  See More Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentPage;