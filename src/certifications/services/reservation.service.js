import axios from "../../config/axios.config.js";

const API_URL = `/reservations`;

/**
 * Reservation service for managing certification appointment reservations
 * Handles CRUD operations for reservation records
 */
export const reservationService = {
  /**
   * Creates a new certification appointment reservation
   * @param {Object} reservationData - The reservation data
   * @param {string} reservationData.userId - ID of the user making the reservation
   * @param {string} reservationData.date - Reservation date (ISO string)
   * @param {string} reservationData.time - Reservation time
   * @param {string} reservationData.serviceType - Type of certification service
   * @param {string} [reservationData.notes] - Optional notes for the reservation
   * @returns {Promise<Object>} The created reservation record
   * @throws {Error} When reservation creation fails
   */
  async createReservation(reservationData) {
    try {
      const response = await axios.post(API_URL, reservationData);
      return response.data;
    } catch (error) {
      console.error("Error creating reservation:", error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Retrieves all reservation records
   * @returns {Promise<Array>} Array of all reservation records
   * @throws {Error} When fetching reservations fails
   */
  async getAllReservations() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching all reservations:", error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Retrieves a specific reservation record by ID
   * @param {string|number} id - The reservation ID
   * @returns {Promise<Object>} The reservation record
   * @throws {Error} When reservation is not found or request fails
   */
  async getReservationById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reservation with ID ${id}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Updates an existing reservation record
   * @param {string|number} id - The reservation ID
   * @param {Object} reservationData - The updated reservation data
   * @param {string} [reservationData.date] - Updated reservation date
   * @param {string} [reservationData.time] - Updated reservation time
   * @param {string} [reservationData.serviceType] - Updated service type
   * @param {string} [reservationData.status] - Updated reservation status
   * @param {string} [reservationData.notes] - Updated notes
   * @returns {Promise<Object>} The updated reservation record
   * @throws {Error} When update fails or reservation is not found
   */
  async updateReservation(id, reservationData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, reservationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating reservation with ID ${id}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
};