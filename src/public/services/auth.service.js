import axios from '../../config/axios.config.js';

/**
 * Authentication service for managing user and admin authentication
 * Handles login, registration, token management, and session storage
 */
export const authService = {
  /**
   * Authenticates a regular user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} Authentication result with success status and user data
   */
  async login(email, password) {
    try {
      const response = await axios.post(`/auth/login`, {
        email: email,
        password: password
      });
      
      // Store JWT token and user data
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          plan: response.data.plan
        }));
        
        // Also save in currentSession for compatibility
        localStorage.setItem('currentSession', JSON.stringify({
          userId: response.data.id,
          name: response.data.name,
          email: response.data.email,
          plan: response.data.plan,
          isLoggedIn: true,
          isAdmin: false
        }));
      }
      
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      // Reduce logs for expected errors
      if (error.response?.status !== 401) {
        console.error('Login error:', error);
      }
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data || 'Authentication error'
      };
    }
  },

  /**
   * Registers a new user account
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @param {string} [userData.plan] - User's subscription plan
   * @returns {Promise<Object>} Registration result with success status and user data
   */
  async register(userData) {
    try {
      const response = await axios.post(`/auth`, userData);
      
      // Store JWT token and user data after successful registration
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          plan: response.data.plan
        }));
        
        // Also save in currentSession for compatibility
        localStorage.setItem('currentSession', JSON.stringify({
          userId: response.data.id,
          name: response.data.name,
          email: response.data.email,
          plan: response.data.plan,
          isLoggedIn: true,
          isAdmin: false
        }));
      }
      
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data || 'Registration error'
      };
    }
  },

  /**
   * Authenticates an admin user with email and password
   * Uses the admin endpoint and verifies admin permissions
   * @param {string} email - Admin's email address
   * @param {string} password - Admin's password
   * @returns {Promise<Object>} Authentication result with success status and admin data
   */
  async loginAdmin(email, password) {
    try {
      // Use the admin endpoint
      const response = await axios.post(`/admin_user/login`, {
        email: email,
        password: password
      });
    
      // Verify if user has admin permissions
      const user = response.data;
      
      // Adjust this logic based on how you determine admin status in your backend
      const isAdmin = user.role === 'admin' || user.isAdmin || user.email.includes('admin');
      
      if (!isAdmin) {
        return {
          success: false,
          message: 'You do not have administrator permissions'
        };
      }
    
      // Store admin JWT token
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          isAdmin: true
        }));
        localStorage.setItem('adminToken', 'admin_session');
        localStorage.setItem('currentAdmin', JSON.stringify(response.data));
        localStorage.setItem('currentSession', JSON.stringify({
          userId: response.data.id,
          name: response.data.name,
          email: response.data.email,
          isLoggedIn: true,
          isAdmin: true
        }));
      }
    
      return {
        success: true,
        user: response.data,
        isAdmin: true
      };
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data || 'Administrator authentication error'
      };
    }
  },

  /**
   * Retrieves the stored authentication token
   * @returns {string|null} The JWT token or null if not found
   */
  getToken() {
    return localStorage.getItem('authToken');
  },

  /**
   * Retrieves the current authenticated user data
   * @returns {Object|null} The current user object or null if not found
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Checks if the user is currently authenticated
   * @returns {boolean} True if user has valid token and user data
   */
  isAuthenticated() {
    return !!this.getToken() && !!this.getCurrentUser();
  },

  /**
   * Checks if the current user has admin privileges
   * @returns {boolean} True if user is an admin
   */
  isAdmin() {
    return !!localStorage.getItem('adminToken');
  },

  /**
   * Logs out the current user by clearing all authentication data
   * Removes tokens, user data, and session information from localStorage
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('currentAdmin');
    localStorage.removeItem('currentSession');
  }
};