import axios from 'axios';
import { environment } from '@/environments/environment.development';

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${environment.serverBasePath}/users/login`, {
        email: email,
        password: password
      });
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data || 'Error de autenticación'
      };
    }
  },

  async loginAdmin(email, password) {
    try {
      const response = await axios.post(`${environment.serverBasePath}/admin_user/login`, {
        email: email,
        password: password
      });

      return {
        success: true,
        user: response.data,
        isAdmin: true
      };
    } catch (error) {
      console.error('Error en login admin:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data || 'Error de autenticación de administrador'
      };
    }
  }
};