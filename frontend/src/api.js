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

// Enhanced response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Endpoints ==============================================

// Prediction Endpoints
export const savePredictionResult = (predictionData) => API.post('/predict/save-result', predictionData, {
  timeout: 10000 // 10 seconds timeout for prediction save
});

export const uploadImageFile = (formData, onUploadProgress) => API.post('/predict/upload-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: progressEvent => {
    if (onUploadProgress) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onUploadProgress(percentCompleted);
    }
  },
  timeout: 30000 // 30 seconds timeout for uploads
});

// Enhanced Prediction Analysis
export const analyzeSkinCondition = async (imageFile, symptoms) => {
  try {
    // Step 1: Upload image
    const uploadResponse = await uploadImageFile(imageFile);
    
    // Step 2: Save results with symptoms
    const predictionData = {
      imageInfo: uploadResponse.data.imageInfo,
      symptoms,
      timestamp: new Date().toISOString()
    };
    
    return await savePredictionResult(predictionData);
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
};

// History Endpoints
export const getHistory = (limit = 10) => API.get(`/history?limit=${limit}`);
export const getHistoryEntry = (id) => API.get(`/history/${id}`);
export const deleteHistoryEntry = (id) => API.delete(`/history/${id}`);

// User Endpoints
export const getUserProfile = () => API.get('/profile');
export const updateProfile = (profileData) => API.put('/profile', profileData);

// Enhanced Symptoms Endpoints
export const getSymptomQuestions = (disease) => 
  API.get(`/symptoms/questions?disease=${encodeURIComponent(disease)}`, {
    timeout: 5000
  });

export const submitSymptoms = (data) => 
  API.post('/symptoms/submit', data, {
    timeout: 8000
  });

// Clinic Endpoints
export const getClinics = (location, radius = 10) => 
  API.get(`/clinics?location=${encodeURIComponent(location)}&radius=${radius}`);

export const getClinicDetails = (id) => API.get(`/clinics/${id}`);
export const bookAppointment = (bookingData) => API.post('/clinics/book', bookingData);

// New Symptom Analysis Endpoint
export const analyzeSymptoms = (symptoms) => 
  API.post('/predict/analyze-symptoms', { symptoms }, {
    timeout: 6000
  });

export default API;