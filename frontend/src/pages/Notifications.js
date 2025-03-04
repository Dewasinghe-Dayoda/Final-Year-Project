// 📌 Purpose: If you plan to send alerts (e.g., “Your doctor report is ready”), this page can show them.
// 📌 Location: src/pages/Notifications.js

import React from "react";
import "../styles/Notifications.css";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      message: "Your scan results for Athlete's Foot are ready.",
      date: "2023-10-01",
    },
    {
      id: 2,
      message: "New feature: Symptom checker now available!",
      date: "2023-09-28",
    },
  ];

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <p>{notification.message}</p>
            <span>{notification.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;