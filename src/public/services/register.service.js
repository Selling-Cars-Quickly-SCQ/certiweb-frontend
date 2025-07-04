import axios from 'axios';
import { environment } from '@/environments/environment.development';

const API_URL = `${environment.serverBasePath}/users`;

/**
 * Registration service for creating new user accounts
 * Handles user registration through the backend API
 */
export const registerService = {
  /**
   * Registers a new user account in the system
   * @param {Object} userData - The user registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email address (must be unique)
   * @param {string} userData.password - User's password
   * @param {string} [userData.phone] - User's phone number (optional)
   * @param {string} [userData.plan] - User's subscription plan (optional)
   * @returns {Promise<Object>} The created user data from the backend
   * @throws {Error} When registration fails (email already exists, validation errors, etc.)
   */
  async registerUser(userData) {
    try {
      const response = await axios.post(API_URL, userData);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
};