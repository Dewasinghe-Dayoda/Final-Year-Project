import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments, cancelAppointment } from '../api';
import { format } from 'date-fns';
import '../styles/AppointmentHistory.css';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAppointments();
      
      if (response.error) {
        throw new Error(response.error);
      }

      setAppointments(response.appointments || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || 'Failed to fetch appointments. Please try again.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(id);
        setAppointments(appointments.map(appt => 
          appt._id === id ? { ...appt, status: 'cancelled' } : appt
        ));
      } catch (err) {
        setError(err.message || 'Failed to cancel appointment');
      }
    }
  };

  const statusBadge = (status) => {
    const statusClasses = {
      confirmed: 'badge-confirmed',
      cancelled: 'badge-cancelled',
      completed: 'badge-completed',
      pending: 'badge-pending'
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) return <div className="loading">Loading appointments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="appointment-history-container">
      <h2>Your Appointments</h2>
      
      {appointments.length === 0 ? (
        <div className="no-appointments">
          <p>You don't have any appointments yet.</p>
          <button onClick={() => navigate('/AppointmentPage')} className="btn-book">
            Book an Appointment
          </button>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map(appointment => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <h3>{appointment.clinicId?.name || 'Clinic'}</h3>
                {statusBadge(appointment.status)}
              </div>
              
              <div className="appointment-details">
                <p><strong>Doctor:</strong> Dr. {appointment.doctorName}</p>
                <p><strong>Date:</strong> {format(new Date(appointment.date), 'PPP')}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Reference:</strong> {appointment.reference}</p>
                {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
              </div>
              
              <div className="appointment-actions">
                {appointment.status === 'confirmed' && (
                  <>
                    <button 
                      onClick={() => navigate(`/clinics/${appointment.clinicId?._id}`)}
                      className="btn-reschedule"
                    >
                      Reschedule
                    </button>
                    <button 
                      onClick={() => handleCancel(appointment._id)}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;