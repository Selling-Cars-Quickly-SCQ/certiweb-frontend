import axios from 'axios';
import { environment } from '@/environments/environment.development';

const API_URL = `${environment.serverBasePath}/reservations`;

/**
 * History service for managing user reservation history
 * Handles fetching and filtering reservation records by user
 */
export const historyService = {
  /**
   * Retrieves reservations for a specific user from the backend
   * Includes client-side filtering as a backup to ensure data integrity
   * @param {string|number} userId - The user ID to filter reservations for
   * @returns {Promise<Array>} A promise that resolves to an array of user's reservations
   * @throws {Error} When the API request fails
   */
  async getReservationsByUserId(userId) {
    if (!userId) {
      console.error('Error: A userId is required to fetch reservations.');
      return [];
    }
    try {
      console.log(`Fetching reservations for userId: ${userId}`);
      console.log(`API URL: ${API_URL}?userId=${userId}`);
      
      const response = await axios.get(`${API_URL}?userId=${userId}`);
      
      console.log('Raw API response:', response.data);
      
      // Client-side filtering as backup to ensure only user's reservations are returned
      const filteredReservations = response.data.filter(reservation => {
        console.log(`Checking reservation userId: ${reservation.userId} against target: ${userId}`);
        return reservation.userId == userId;
      });
      
      console.log('Filtered reservations:', filteredReservations);
      
      return filteredReservations;
    } catch (error) {
      console.error(`Error fetching reservations for user ${userId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },
};