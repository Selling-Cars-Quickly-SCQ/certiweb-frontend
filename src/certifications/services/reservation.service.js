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
  }
};