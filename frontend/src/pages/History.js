import React from "react";
import "../styles/History.css";
import historyImage from "../assets/history.png";  

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
      <h1>
        <img src={historyImage} alt="History Icon" className="history-image" /> Scan History
      </h1>
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

