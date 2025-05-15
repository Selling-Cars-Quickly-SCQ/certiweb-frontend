import axios from "axios";
import { environment } from '../../environments/environment.development.js';

export const userService = {
  async getCurrentUser() {
    try {
      // Obtener datos de la sesión actual del localStorage
      const sessionData = JSON.parse(localStorage.getItem('currentSession') || '{}');
      
      if (!sessionData.userId) {
        throw new Error('No hay sesión activa');
      }
      
      // Obtener datos completos del usuario desde la API
      const response = await axios.get(`${environment.serverBasePath}/users/${sessionData.userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error.response ? error.response.data : error.message);
      
      // Si falla la API, intentar usar los datos de la sesión
      const sessionData = JSON.parse(localStorage.getItem('currentSession') || '{}');
      if (sessionData.name) {
        return sessionData;
      }
      
      throw error;
    }
  },
  
  async logout() {
    // Eliminar la sesión del localStorage
    localStorage.removeItem('currentSession');
  }
};

