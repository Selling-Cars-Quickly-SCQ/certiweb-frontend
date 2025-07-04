import axios from 'axios';
import { environment } from '../environments/environment.development.js';

/**
 * Axios configuration for the CertiWeb application
 * Sets up base URL, request/response interceptors, and authentication handling
 */

// Configure base URL for all API requests
axios.defaults.baseURL = environment.serverBasePath;

/**
 * Request interceptor to automatically add authentication token to requests
 * Retrieves JWT token from localStorage and adds it to Authorization header
 */
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle authentication errors globally
 * Automatically clears expired tokens and emits auth-expired event
 */
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired tokens and session data
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('currentAdmin');
      localStorage.removeItem('currentSession');
      
      // Emit custom event for components to handle auth expiration
      window.dispatchEvent(new CustomEvent('auth-expired'));
    }
    return Promise.reject(error);
  }
);

export default axios;