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

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'appointment':
        return <i className="fas fa-calendar-check"></i>;
      case 'system':
        return <i className="fas fa-exclamation-circle"></i>;
      case 'reminder':
        return <i className="fas fa-bell"></i>;
      default:
        return <i className="fas fa-info-circle"></i>;
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getNotifications();
        
        if (isMounted) {
          if (response && response.data) {
            // Handle both response structures
            const notificationsData = response.data.notifications || response.data;
            setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
          } else {
            setNotifications([]);
          }
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        if (isMounted) {
          setError(err.response?.data?.error || err.message || 'Failed to fetch notifications');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error("Error marking as read:", err);
      setError(err.response?.data?.error || err.message || 'Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notif => notif._id !== id)
      );
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError(err.response?.data?.error || err.message || 'Failed to delete notification');
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
                <div className="notification-header">
                  <span className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <h3>{notification.title}</h3>
                </div>
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