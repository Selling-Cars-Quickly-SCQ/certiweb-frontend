import axios from "../../config/axios.config.js";

const API_URL = `/cars`;

/**
 * Car service for managing car certifications
 * Handles CRUD operations for car certification records
 */
export const carService = {
  /**
   * Creates a new car certification record
   * @param {Object} carData - The car certification data
   * @param {string} carData.brand - Car brand
   * @param {string} carData.model - Car model
   * @param {string} carData.year - Car year
   * @param {string} carData.vin - Vehicle identification number
   * @param {string} carData.userId - User ID who owns the certification
   * @returns {Promise<Object>} The created car certification record
   * @throws {Error} When creation fails
   */
  async createCar(carData) {
    try {
      console.log('=== DEBUGGING PAYLOAD ===');
      console.log('Complete payload:', JSON.stringify(carData, null, 2));
      console.log('Data types:');
      Object.keys(carData).forEach(key => {
        console.log(`${key}: ${typeof carData[key]} = ${carData[key]}`);
      });
      console.log('========================');
      
      const response = await axios.post(API_URL, carData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      });
      
      console.log('Backend response:', response.data);
      return response.data;
    } catch (error) {
      console.error("Complete error:", error);
      
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           `Error ${error.response.status}: ${error.response.statusText}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("No server response:", error.request);
        throw new Error("Could not connect to server");
      } else {
        console.error("Configuration error:", error.message);
        throw new Error("Error configuring request: " + error.message);
      }
    }
  },

  /**
   * Retrieves all car certification records
   * @returns {Promise<Array>} Array of car certification records
   */
  async getAllCars() {
    try {
      const response = await axios.get(API_URL);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching cars:", error);
      return [];
    }
  },

  /**
   * Retrieves a specific car certification record by ID
   * @param {string|number} id - The car certification ID
   * @returns {Promise<Object>} The car certification record
   * @throws {Error} When car is not found or request fails
   */
  async getCarById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching car ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Retrieves the PDF certificate for a specific car
   * @param {string|number} id - The car certification ID
   * @returns {Promise<Object>} The PDF data or download link
   * @throws {Error} When PDF generation fails or car is not found
   */
  async getCarPdf(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}/pdf`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching PDF for car ${id}:`, error);
      throw error;
    }
  },

  /**
   * Updates an existing car certification record
   * @param {string|number} id - The car certification ID
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} The updated car certification record
   * @throws {Error} When update fails or car is not found
   */
  async updateCar(id, updateData) {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating car ${id}:`, error);
      throw error;
    }
  },
}