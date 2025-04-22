import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.css';
import profileImage from '../assets/profile.png';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/api/auth/user', {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!res.data) {
                    throw new Error('No user data received');
                }

                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            } catch (error) {
                console.error('Profile fetch error:', error);
                setError(error.response?.data?.message || 'Failed to load profile. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return <div className="user-profile-container">Loading profile...</div>;
    }

    if (error) {
        return <div className="user-profile-container">{error}</div>;
    }

    return (
        <div className="user-profile-container">
            <div className="user-profile-frame">
                <h1>User Profile</h1>
                <div className="profile-content">
                    <div className="profile-image">
                        <img src={profileImage} alt="Profile" />
                    </div>
                    <div className="profile-details">
                        <h2>{user?.name}</h2>
                        <p>Email: {user?.email}</p>
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;