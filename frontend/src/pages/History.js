// keep the previous results of the user in this page
// Purpose: Allow users to see past QuickCheck predictions.
// 📌 How? Store previous results in localStorage (if unauthenticated) or in the database (for logged-in users).
// 📌 Location: src/pages/History.js
// 📌 Navigation: Add a button in UserProfile.js to access this page.

import React from "react";

const History = () => {
  return (
    <div>
      <h1>History os your previous predictions.</h1>
      <p>This website helps users detect bacterial and fungal skin diseases using AI-based image analysis.</p>
    </div>
  );
};

export default History;
