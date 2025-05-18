import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/ClinicDetailsPage.css';
import { getClinicDetails, bookAppointment } from '../api';

const ClinicDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [notes, setNotes] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth();

    const fetchClinicDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getClinicDetails(id);
        
        if (!response) throw new Error('No response received from server');
        if (response.error) throw new Error(response.error);
        if (!response.data) throw new Error('Clinic data not found');

        setClinic(response.data);
      } catch (error) {
        console.error("Error fetching clinic details:", error);
        setError(error.message || 'Failed to load clinic details');
      } finally {
        setLoading(false);
      }
    };

    fetchClinicDetails();
  }, [id]);

  const getAvailableDoctors = () => {
    if (!selectedDate || !clinic?.doctors) return [];
    const day = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    return clinic.doctors.filter(doctor => 
      doctor.availability?.some(a => a.day === day)
    ) || [];
  };

  const getAvailableTimes = () => {
    if (!selectedDoctor || !selectedDate || !clinic?.doctors) return [];
    const day = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const doctor = clinic.doctors.find(d => d.name === selectedDoctor);
    if (!doctor || !doctor.availability) return [];
    
    const availability = doctor.availability.find(a => a.day === day);
    return availability?.slots || [];
  };

  const handleBooking = async () => {
    try {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: `/clinics/${id}` } });
        return;
      }

      if (!selectedDate || !selectedDoctor || !selectedTime) {
        throw new Error('Please select date, doctor and time');
      }

      setLoading(true);
      setError(null);

      const bookingResponse = await bookAppointment({
        clinicId: clinic._id,
        doctorName: selectedDoctor,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        notes: notes || "Skin condition consultation"
      });

      if (bookingResponse.error) {
        if (bookingResponse.status === 409) {
          // Handle conflict - show existing appointment
          setBookingData({
            ...bookingResponse.existingAppointment,
            conflict: true,
            conflictType: bookingResponse.conflictType
          });
          setBookingSuccess(true);
          return;
        }
        throw new Error(bookingResponse.error);
      }

      setBookingData(bookingResponse);
      setBookingSuccess(true);
      
      // Reset form
      setSelectedDoctor('');
      setSelectedDate(null);
      setSelectedTime('');
      setNotes('');
      
    } catch (error) {
      console.error("Booking Error:", error);
      setError(error.message);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login', { state: { from: `/clinics/${id}` } });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading clinic details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!clinic) return <div className="not-found">Clinic not found</div>;

  return (
    <div className="clinic-details-container">
      {bookingSuccess && bookingData && (
        <div className={`booking-success ${bookingData.conflict ? 'conflict' : ''}`}>
          <h3>
            {bookingData.conflict 
              ? bookingData.conflictType === 'user'
                ? "You already have this appointment"
                : "Time Slot Unavailable"
              : "Booking Confirmed!"}
          </h3>
          <p>
            {bookingData.conflict
              ? bookingData.conflictType === 'user'
                ? "You've already booked this time slot:"
                : "This time slot is already booked by another user."
              : `Your appointment with Dr. ${bookingData.doctorName} has been scheduled.`}
          </p>
          <p>Date: {new Date(bookingData.date).toLocaleDateString()}</p>
          <p>Time: {bookingData.time}</p>
          <p>Reference: {bookingData.reference}</p>
          <button 
            onClick={() => navigate('/appointmenthistory')}
            className="btn-view-appointments"
          >
            View All Appointments
          </button>
        </div>
      )}
      
      <div className="clinic-header">
        <h1>{clinic.name}</h1>
        <p className="address">{clinic.address}</p>
        <div className="contact-info">
          <p><strong>Phone:</strong> {clinic.phone}</p>
          {clinic.email && <p><strong>Email:</strong> {clinic.email}</p>}
          {clinic.website && (
            <p>
              <strong>Website:</strong> 
              <a href={`https://${clinic.website}`} target="_blank" rel="noopener noreferrer">
                {clinic.website}
              </a>
            </p>
          )}
        </div>
      </div>

      {clinic.images && clinic.images.length > 0 && (
        <div className="clinic-images">
          {clinic.images.map((img, index) => (
            <div key={index} className="clinic-image">
              <img 
                src={`/images/clinics/${img}`} 
                alt={`${clinic.name} ${index + 1}`} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/clinics/default-clinic.jpg';
                }}
              />
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
        <h2>Book Appointment</h2>
        
        <div className="booking-form-container">
          <div className="form-group">
            <label>Select Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={date => {
                setSelectedDate(date);
                setSelectedDoctor('');
                setSelectedTime('');
              }}
              minDate={new Date()}
              placeholderText="Select appointment date"
              dateFormat="MMMM d, yyyy"
              className="date-picker-input"
            />
          </div>

          {selectedDate && (
            <div className="form-group">
              <label>Select Doctor:</label>
              <select
                value={selectedDoctor}
                onChange={(e) => {
                  setSelectedDoctor(e.target.value);
                  setSelectedTime('');
                }}
                disabled={!selectedDate}
              >
                <option value="">Select doctor</option>
                {getAvailableDoctors().map(doctor => (
                  <option key={doctor.name} value={doctor.name}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedDoctor && (
            <div className="form-group">
              <label>Select Time Slot:</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={!selectedDoctor}
              >
                <option value="">Select time</option>
                {getAvailableTimes().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Notes (Optional):</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about your condition"
              rows="3"
            />
          </div>

          <button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedDoctor || !selectedTime || loading}
            className="book-button"
          >
            {loading ? 'Processing...' : 'Confirm Appointment'}
          </button>
        </div>

        <h2>Our Dermatologists</h2>
        {clinic.doctors && clinic.doctors.length > 0 ? (
          <div className="doctors-grid">
            {clinic.doctors.map((doctor) => (
              <div key={doctor.name} className="doctor-card">
                <div className="doctor-info">
                  <h3>Dr. {doctor.name}</h3>
                  <p><strong>Specialization:</strong> {doctor.specialization}</p>
                  <p><strong>Qualifications:</strong> {doctor.qualifications}</p>
                  <p><strong>Experience:</strong> {doctor.experience}</p>
                  
                  <div className="availability">
                    <h4>Availability:</h4>
                    <ul>
                      {doctor.availability?.map((day, index) => (
                        <li key={index}>
                          <strong>{day.day}:</strong> {day.slots.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
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