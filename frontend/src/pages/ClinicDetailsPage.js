import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClinicDetails, bookAppointment } from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/ClinicDetailsPage.css';

const ClinicDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchClinicDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getClinicDetails(id);
        
        if (response.data && response.data.success) {
          setClinic(response.data.data);
        } else {
          throw new Error(response.data?.error || 'Failed to load clinic details');
        }
      } catch (error) {
        console.error("Error fetching clinic details:", error);
        setError(error.message || "Failed to load clinic details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClinicDetails();
  }, [id]);

  const handleBooking = async () => {
    try {
      setLoading(true);
      const { data } = await bookAppointment({
        clinicId: clinic._id,
        doctorName: selectedDoctor,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        patientId: localStorage.getItem('userId')
      });
      
      alert(`Booking confirmed! Reference: ${data.booking.reference}`);
      navigate('/history');
    } catch (error) {
      console.error("Booking Error:", error);
      alert('Booking failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const availableTimes = selectedDoctor && selectedDate && clinic?.doctors
    ? clinic.doctors
        .find(d => d.name === selectedDoctor)
        ?.availability
        .find(a => a.day === selectedDate.toLocaleDateString('en-US', { weekday: 'long'}))
        ?.slots || []
    : [];

  if (loading) return <div className="loading">Loading clinic details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!clinic) return <div className="not-found">Clinic not found</div>;

  return (
    <div className="clinic-details-container">
      <div className="clinic-header">
        <h1>{clinic.name}</h1>
        <p className="address">{clinic.address}</p>
        <div className="contact-info">
          <p><strong>Phone:</strong> {clinic.phone}</p>
          {clinic.email && <p><strong>Email:</strong> {clinic.email}</p>}
          {clinic.website && <p><strong>Website:</strong> <a href={`https://${clinic.website}`} target="_blank" rel="noopener noreferrer">{clinic.website}</a></p>}
        </div>
      </div>

      {clinic.images && clinic.images.length > 0 && (
        <div className="clinic-images">
          {clinic.images.map((img, index) => (
            <div key={index} className="clinic-image">
              <img src={`/images/clinics/${img}`} alt={`${clinic.name} ${index + 1}`} />
            </div>
          ))}
        </div>
      )}

      <div className="clinic-info-section">
        <h2>About the Clinic</h2>
        <p>{clinic.description}</p>
        
        <div className="details-grid">
          <div className="detail-item">
            <h3>Opening Hours</h3>
            <p>{clinic.openingHours}</p>
          </div>
          
          <div className="detail-item">
            <h3>Services Offered</h3>
            {clinic.services && clinic.services.length > 0 ? (
              <ul>
                {clinic.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            ) : (
              <p>No services listed</p>
            )}
          </div>
        </div>
      </div>

      <div className="doctors-section">
        <h2>Our Dermatologists</h2>
        {clinic.doctors && clinic.doctors.length > 0 ? (
          <div className="doctors-grid">
            {clinic.doctors.map((doctor) => (
              <div key={doctor.name} className="doctor-card">
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p><strong>Specialization:</strong> {doctor.specialization}</p>
                  <p><strong>Qualifications:</strong> {doctor.qualifications}</p>
                  <p><strong>Experience:</strong> {doctor.experience}</p>
                </div>
                
                <div className="booking-form">
                  <h3>Book Appointment</h3>
                  <div className="form-group">
                    <label>Date:</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={date => setSelectedDate(date)}
                      minDate={new Date()}
                      filterDate={date => {
                        const day = date.toLocaleDateString('en-US', { weekday: 'long'});
                        return doctor.availability?.some(a => a.day === day);
                      }}
                      placeholderText="Select available date"
                    />
                  </div>

                  {selectedDate && (
                    <div className="form-group">
                      <label>Time Slot:</label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      >
                        <option value="">Select time</option>
                        {availableTimes.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      setSelectedDoctor(doctor.name);
                      if (selectedDate && selectedTime) {
                        handleBooking();
                      }
                    }}
                    disabled={!selectedDate || !selectedTime || loading}
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No doctors listed for this clinic</p>
        )}
      </div>
    </div>
  );
};

export default ClinicDetailsPage;