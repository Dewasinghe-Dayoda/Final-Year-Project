import React, { useState, useEffect } from 'react';
import { getClinics, bookAppointment } from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const AppointmentPage = () => {
  const [clinics, setClinics] = useState([]);
  const [location, setLocation] = useState('Colombo');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        const { data } = await getClinics(location);
        setClinics(data);
      } catch (error) {
        alert('Failed to load clinics: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, [location]);

  const handleBooking = async () => {
    try {
      setLoading(true);
      const { data } = await bookAppointment({
        clinicId: selectedClinic._id,
        doctorName: selectedDoctor,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        patientId: localStorage.getItem('userId')
      });
      
      alert(`Booking confirmed! Reference: ${data.booking.reference}`);
      navigate('/history');
    } catch (error) {
      alert('Booking failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const availableTimes = selectedDoctor && selectedDate 
    ? selectedClinic.doctors
        .find(d => d.name === selectedDoctor)
        ?.availability
        .find(a => a.day === selectedDate.toLocaleDateString('en-US', { weekday: 'long'}))
        ?.slots || []
    : [];

  return (
    <div className="appointment-container">
      <h2>Book Dermatology Appointment</h2>
      
      <div className="search-section">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location (e.g. Colombo)"
        />
      </div>

      {loading && <p>Loading clinics...</p>}

      <div className="clinics-list">
        {clinics.map(clinic => (
          <div 
            key={clinic._id}
            className={`clinic-card ${selectedClinic?._id === clinic._id ? 'selected' : ''}`}
            onClick={() => setSelectedClinic(clinic)}
          >
            <h3>{clinic.name}</h3>
            <p>{clinic.address}</p>
            <p>☎ {clinic.phone}</p>
            <div className="services">
              {clinic.services.join(', ')}
            </div>
          </div>
        ))}
      </div>

      {selectedClinic && (
        <div className="booking-form">
          <h3>Book at {selectedClinic.name}</h3>
          
          <div className="form-group">
            <label>Doctor:</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">Select doctor</option>
              {selectedClinic.doctors.map(doctor => (
                <option key={doctor.name} value={doctor.name}>
                  {doctor.name} ({doctor.specialization})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              minDate={new Date()}
              filterDate={date => {
                const day = date.toLocaleDateString('en-US', { weekday: 'long'});
                return selectedDoctor 
                  ? selectedClinic.doctors
                      .find(d => d.name === selectedDoctor)
                      ?.availability.some(a => a.day === day)
                  : true;
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
                disabled={!selectedDoctor}
              >
                <option value="">Select time</option>
                {availableTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          )}

          <button 
            onClick={handleBooking}
            disabled={!selectedDoctor || !selectedDate || !selectedTime || loading}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;