import React, { useState, useEffect } from 'react';
import { getClinics } from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/AppointmentPage.css';

const AppointmentPage = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchClinics = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getClinics('Colombo');
        setClinics(data);
      } catch (error) {
        console.error("API Error:", error);
        setError("Failed to load clinics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, [navigate]);

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
                  {clinic.services.slice(0, 3).map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
              
              <div className="clinic-actions">
                <button 
                  onClick={() => navigate(`/clinics/${clinic._id}`)}
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