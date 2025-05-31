import axios from "axios"
import { environment } from "../../environments/environment.development.js"

const API_URL = `${environment.serverBasePath}/cars`

export const carService = {
  async createCar(carData) {
    try {
      const response = await axios.post(API_URL, carData)
      return response.data
    } catch (error) {
      console.error("Error al crear el anuncio del auto:", error.response ? error.response.data : error.message)
      throw error
    }
  },

  async getAllCars() {
    try {
      const response = await axios.get(API_URL)
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error("Network Error:", error)
      return []
    }
  },

  async getCarById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener el auto con ID ${id}:`, error.response ? error.response.data : error.message)
      throw error
    }
  },

  async updateCar(id, updateData) {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, updateData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar el auto con ID ${id}:`, error.response ? error.response.data : error.message)
      throw error
    }
  },
}