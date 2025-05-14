import axios from 'axios';
import { environment } from '@/environments/environment.development';

const API_URL = `${environment.serverBasePath}/users`;

export const registerService = {
  async registerUser(userData) {
    try {
      const response = await axios.post(API_URL, userData);
      return response.data;
    } catch (error) {
      console.error("Error al registrar el usuario:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
};