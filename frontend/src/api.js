import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-actual-render-app-name.onrender.com/api'  // UPDATE THIS with your actual Render URL
  : 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: This ensures cookies are sent
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't auto-redirect on 401 - let components handle authentication
    // The AuthContext and PrivateRoute will handle redirects properly
    return Promise.reject(error);
  }
);

export default api;
