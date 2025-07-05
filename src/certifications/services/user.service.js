import axios from "../../config/axios.config.js";

/**
 * User service for managing user authentication and data
 * Handles user session management and API interactions
 */
export const userService = {
  /**
   * Retrieves the current authenticated user's data
   * First attempts to get user data from the API using stored session info,
   * then falls back to email lookup if direct ID lookup fails,
   * finally returns cached session data as last resort
   * @returns {Promise<Object>} The current user object
   * @throws {Error} When no active session exists or user cannot be found
   */
  async getCurrentUser() {
    try {
      const sessionData = JSON.parse(localStorage.getItem('currentSession') || '{}');
      
      if (!sessionData.userId) {
        throw new Error('No active session found');
      }
      
      try {
        // Attempt to fetch user data from API using stored user ID
        const response = await axios.get(`/users/${sessionData.userId}`);
        const userData = response.data;
        userData.id = userData.id || sessionData.userId;
        return userData;
      } catch (error) {
        // Fallback: try to find user by email if direct ID lookup fails
        if (sessionData.email) {
          const usersResponse = await axios.get(`/users?email=${sessionData.email}`);
          if (usersResponse.data && usersResponse.data.length > 0) {
            const user = usersResponse.data[0];
    
            // Update session with correct user ID
            sessionData.userId = user.id;
            localStorage.setItem('currentSession', JSON.stringify(sessionData));
            user.id = user.id || sessionData.userId;
            return user;
          }
        }
        throw error;
      }
    } catch (error) {
      console.error("Error fetching current user:", error.response ? error.response.data : error.message);
      
      // Last resort: return cached session data if available
      const sessionData = JSON.parse(localStorage.getItem('currentSession') || '{}');
      if (sessionData.name && sessionData.userId) {
        sessionData.id = sessionData.id || sessionData.userId;
        return sessionData;
      }
      
      throw error;
    }
  },
  
  /**
   * Logs out the current user by clearing all session data
   * Removes authentication tokens and user data from localStorage
   * @returns {Promise<void>}
   */
  async logout() {
    localStorage.removeItem('currentSession');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }
};