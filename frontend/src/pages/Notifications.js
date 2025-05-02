import React, { useState, useEffect } from 'react';
import { 
  getNotifications, 
  markNotificationAsRead, 
  deleteNotification 
} from '../api';
import { format } from 'date-fns';
import '../styles/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data } = await getNotifications();
        setNotifications(data.notifications);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(notif => 
        notif._id === id ? { ...notif, read: true } : notif
      ));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(notif => notif._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete notification');
    }
  };

  if (loading) return <div className="loading">Loading notifications...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      
      {notifications.length === 0 ? (
        <div className="no-notifications">
          <p>You don't have any notifications yet.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <small>{format(new Date(notification.createdAt), 'PPPpp')}</small>
              </div>
              
              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="btn-mark-read"
                  >
                    Mark as Read
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(notification._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;