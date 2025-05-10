import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 86400, //24h timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Request interceptor for auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    if (response.data?.success === false) {
      return Promise.reject(response.data.message || 'Request failed');
    }
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code outside 2xx
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     'An error occurred';
      
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('No response from server'));
    } else {
      // Something happened in setting up the request
      return Promise.reject(new Error(error.message));
    }
  }
);

// API Endpoints 
// Auth Endpoints
export const registerUser = (userData) =>
   API.post('/auth/register', userData);
export const loginUser = (credentials) =>
   API.post('/auth/login', credentials);
export const getUserProfile = () =>
   API.get('/pages/UserProfile');
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
export const getHistory = (limit = 10) =>
   API.get(`/history?limit=${limit}`);
export const getHistoryEntry = (id) => 
  API.get(`/history/${id}`);
export const deleteHistoryEntry = (id) =>
   API.delete(`/history/${id}`);

// User Endpoints
export const updateProfile = (profileData) => 
  API.put('/profile', profileData);

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
export const getClinics = async (location, radius = 10) => {
  try {
    const response = await API.get(`/clinics?location=${encodeURIComponent(location)}&radius=${radius}`);
    return {
      data: Array.isArray(response.data) ? response.data : response.data.data,
      status: response.status
    };
  } catch (error) {
    console.error('Error fetching clinics:', error);
    throw error;
  }
};
export const getClinicDetails = async (id) => {
  try {
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error('Invalid clinic ID format');
    }
    
    const response = await API.get(`/clinics/${id}`);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('No clinic data received');
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching clinic details:', error);
    return { error: error.message || 'Failed to fetch clinic details' };
  }
};

export const bookAppointment = (bookingData) => {
  if (!bookingData?.clinicId || !bookingData?.doctorName || 
      !bookingData?.date || !bookingData?.time || !bookingData?.patientId) {
    return Promise.reject(new Error('Missing required booking fields'));
  }
  return API.post('/clinics/book', bookingData);
};
// New Symptom Analysis Endpoint
export const analyzeSymptoms = (symptoms) => 
  API.post('/predict/analyze-symptoms', { symptoms }, {
    timeout: 6000
  });

  // Appointment Endpoints
export const getAppointments = () => 
  API.get('/appointments');
export const cancelAppointment = (id) => 
  API.delete(`/appointments/${id}`);

// Notification Endpoints
export const getNotifications = () =>
  API.get('/notifications');
export const markNotificationAsRead = (id) => 
  API.put(`/notifications/${id}/read`);
export const deleteNotification = (id) => 
  API.delete(`/notifications/${id}`);

export default API;