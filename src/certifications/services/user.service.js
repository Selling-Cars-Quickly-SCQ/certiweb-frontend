import axios from "axios";
import { environment } from '../../environments/environment.development.js';

export const userService = {
  async getCurrentUser() {
    try {
      const sessionData = JSON.parse(localStorage.getItem('currentSession') || '{}');
      
      if (!sessionData.userId) {
        throw new Error('No hay sesión activa');
      }
      
      try {
        const response = await axios.get(`${environment.serverBasePath}/users/${sessionData.userId}`);
        const userData = response.data;
        userData.id = userData.id || sessionData.userId;
        return userData;
      } catch (error) {
        
        if (sessionData.email) {
          const usersResponse = await axios.get(`${environment.serverBasePath}/users?email=${sessionData.email}`);
          if (usersResponse.data && usersResponse.data.length > 0) {
            const user = usersResponse.data[0];
    
            sessionData.userId = user.id;
            localStorage.setItem('currentSession', JSON.stringify(sessionData));
            user.id = user.id || sessionData.userId;
            return user;
          }
        }
        throw error;
      }
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error.response ? error.response.data : error.message);
      
      const sessionData = JSON.parse(localStorage.getItem('currentSession') || '{}');
      if (sessionData.name && sessionData.userId) {
        sessionData.id = sessionData.id || sessionData.userId;
        return sessionData;
      }
      
      throw error;
    }
  },
  
  async logout() {
    localStorage.removeItem('currentSession');
  }
};

