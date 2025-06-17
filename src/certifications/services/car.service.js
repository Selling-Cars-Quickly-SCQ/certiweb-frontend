import axios from "axios"
import { environment } from "../../environments/environment.development.js"

const API_URL = `${environment.serverBasePath}/cars`

export const carService = {
  async createCar(carData) {
    try {
      console.log('=== DEBUGGING PAYLOAD ===');
      console.log('Payload completo:', JSON.stringify(carData, null, 2));
      console.log('Tipos de datos:');
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
      
      console.log('Respuesta del backend:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error completo:", error);
      
      if (error.response) {
        console.error("Datos del error:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           `Error ${error.response.status}: ${error.response.statusText}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Sin respuesta del servidor:", error.request);
        throw new Error("No se pudo conectar con el servidor");
      } else {
        console.error("Error de configuración:", error.message);
        throw new Error("Error al configurar la petición: " + error.message);
      }
    }
  },

  async getAllCars() {
    try {
      const response = await axios.get(API_URL);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error al obtener cars:", error);
      return [];
    }
  },

  async getCarById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener car ${id}:`, error);
      throw error;
    }
  },
  
  async getCarPdf(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}/pdf`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener PDF del car ${id}:`, error);
      throw error;
    }
  },

  async updateCar(id, updateData) {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar car ${id}:`, error);
      throw error;
    }
  },
}