// keep the previous results of the user in this page
// Purpose: Allow users to see past QuickCheck predictions.
// 📌 How? Store previous results in localStorage (if unauthenticated) or in the database (for logged-in users).
// 📌 Location: src/pages/History.js
// 📌 Navigation: Add a button in UserProfile.js to access this page.

// import React from "react";
// import api from '../api';
// import { useState, useEffect } from "react";

// const History = () => {
//   const [history, setHistory] = useState([]);

//   // Fetch user history
//   useEffect(() => {
//       const fetchHistory = async () => {
//           try {
//               const res = await api.get('/api/history');
//               setHistory(res.data);
//           } catch (error) {
//               console.error(error);
//           }
//       };
//       fetchHistory();
//   }, []);

//   return (
//       <div className="history">
//           <h2>History</h2>
//           {history.length === 0 ? (
//               <p>No history found.</p>
//           ) : (
//               history.map((entry) => (
//                   <div key={entry._id} className="history-entry">
//                       <p>Date: {new Date(entry.date).toLocaleString()}</p>
//                       <p>Prediction: {entry.prediction}</p>
//                       <p>Confidence: {(entry.confidence * 100).toFixed(2)}%</p>
//                       <img src={`http://localhost:5000/${entry.imagePath}`} alt="Prediction" width="100" />
//                       <hr />
//                   </div>
//               ))
//           )}
//       </div>
//   );
// };

// export default History;
import React from "react";
import "../styles/History.css";

const History = () => {
  const historyData = [
    {
      date: "2025-01-11",
      condition: "Athlete's Foot",
      confidence: "92%",
    },
    {
      date: "2025-02-25",
      condition: "Ringworm",
      confidence: "08%",
    },
    {
        date: "2025-06-05",
        condition: "Cellulitis",
        confidence: "20%",
      },
      {
        date: "2025-08-10",
        condition: "No Condition",
        confidence: "100%",
      },
      {
        date: "2025-09-25",
        condition: "Other condition",
        confidence: "45%",
      },
  ];

  return (
    <div className="history-container">
      <h1>Scan History</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Condition</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.condition}</td>
              <td>{entry.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
