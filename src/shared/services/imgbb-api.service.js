import { environment } from '../../environments/environment.development';
import axios from "axios";

export class ImgbbApiService {
    
    /**
     * Upload an image to ImgBB
     * @param {File} imageFile - Image file to upload
     * @returns {Promise<Object>} - API response with the image URL
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
            
            const data = await response.json(); 
            return data.data;
        } catch (error) {
            console.error('Error en la carga de imagen:', error);
            throw error;
        }
    }
}

export const imgbbApiService = new ImgbbApiService();