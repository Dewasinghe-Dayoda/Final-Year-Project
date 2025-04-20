import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Endpoints ==============================================

// Prediction Endpoints
export const savePredictionResult = (predictionData) => API.post('/predict/save-result', predictionData);
export const uploadImageFile = (formData) => API.post('/predict/upload-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// History Endpoints
export const getHistory = () => API.get('/history');
export const deleteHistoryEntry = (id) => API.delete(`/history/${id}`);

// User Endpoints
export const getUserProfile = () => API.get('/profile');
export const updateProfile = (profileData) => API.put('/profile', profileData);

// Symptoms Endpoints
export const getSymptomQuestions = (disease) => API.get(`/symptoms/questions?disease=${disease}`);
export const submitSymptoms = (symptomsData) => API.post('/symptoms/submit', symptomsData);


// export const getSymptomQuestions = (disease) => 
//   api.get(`/symptoms/questions?disease=${encodeURIComponent(disease)}`);

// export const submitSymptoms = (data) => 
//   api.post('/symptoms/submit', data);

export default API;