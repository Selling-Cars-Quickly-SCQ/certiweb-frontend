import { environment } from '../../environments/environment.development';
import axios from "axios";

export class ImgbbApiService {
    
    /**
     * Sube una imagen a ImgBB
     * @param {File} imageFile - Archivo de imagen a subir
     * @returns {Promise<Object>} - Respuesta de la API con la URL de la imagen
     */
    async uploadImage(imageFile) {
        try {
            const formData = new FormData();
            formData.append('key', environment.api_key_imgbb);
            formData.append('image', imageFile);
            
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${environment.api_key_imgbb}`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Error al subir imagen: ${response.statusText}`);
            }
            
            const data = await response.json(); // Aquí se convierte la respuesta de ImgBB a un objeto JavaScript (JSON parseado)
            return data.data; // Devuelve la parte "data" del JSON de ImgBB, que contiene las URLs
        } catch (error) {
            console.error('Error en la carga de imagen:', error);
            throw error;
        }
    }
}

// Crear una instancia para exportar
export const imgbbApiService = new ImgbbApiService();