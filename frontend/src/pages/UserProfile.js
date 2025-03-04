// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const UserProfile = () => {
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 navigate('/login'); // Redirect to login if no token is found
//                 return;
//             }

//             try {
//                 const res = await axios.get('http://localhost:5000/api/auth/user', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setUser(res.data);
//             } catch (error) {
//                 console.error(error.response.data);
//                 localStorage.removeItem('token'); // Remove invalid token
//                 navigate('/login'); // Redirect to login if token is invalid
//             }
//         };

//         fetchUserProfile();
//     }, [navigate]);

//     if (!user) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="user-profile">
//             <h2>Welcome, {user.name}!</h2>
//             <p>Email: {user.email}</p>
//             <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>
//                 Logout
//             </button>
//         </div>
//     );
// };

// export default UserProfile;
import React from "react";
import "../styles/UserProfile.css";
import profileImage from "../assets/profile.png"; // Example image path

const UserProfile = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    joined: "2023-01-01",
  };

  return (
    <div className="user-profile-container">
      <h1>User Profile</h1>
      <div className="profile-content">
        <div className="profile-image">
          <img src={profileImage} alt="Profile" />
        </div>
        <div className="profile-details">
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Member since: {user.joined}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;