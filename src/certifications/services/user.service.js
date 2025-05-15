import axios from "axios";
import { environment } from '../../environments/environment.development.js';

export const userService = {
  async getCurrentUser() {
    try {
      const sessionData = JSON.parse(localStorage.getItem('currentSession') || '{}');
      
      if (!sessionData.userId) {
        throw new Error('No hay sesión activa');
      }
      
      const response = await axios.get(`${environment.serverBasePath}/users/${sessionData.userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error.response ? error.response.data : error.message);
      
      const sessionData = JSON.parse(localStorage.getItem('currentSession') || '{}');
      if (sessionData.name) {
        return sessionData;
      }
      
      throw error;
    }
  },
  
  async logout() {
    localStorage.removeItem('currentSession');
  }
};

