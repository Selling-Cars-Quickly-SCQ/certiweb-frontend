import axios from "axios";
import { environment } from '../../environments/environment.development.js';

const API_URL = `${environment.serverBasePath}/reservations`;

export const reservationService = {
  async createReservation(reservationData) {
    try {
      const response = await axios.post(API_URL, reservationData);
      return response.data;
    } catch (error) {
      console.error("Error al crear la reserva:", error.response ? error.response.data : error.message);
      throw error;
    }
  },

  async getAllReservations() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener todas las reservas:", error.response ? error.response.data : error.message);
      throw error;
    }
  },

  async getReservationById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la reserva con ID ${id}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  async updateReservation(id, reservationData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, reservationData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la reserva con ID ${id}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
};