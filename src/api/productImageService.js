// src/api/productImageService.js
import { api } from './authService';

const getProductImages = async (productId) => {
    try {
        const response = await api.get(`/product-images/by-product/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getProductImage = async (imageId) => {
    try {
        const response = await api.get(`/product-images/${imageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createProductImage = async (imageData) => {
    try {
        const response = await api.post('/product-images', imageData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateProductImage = async (imageId, imageData) => {
    try {
        const response = await api.put(`/product-images/${imageId}`, imageData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteProductImage = async (imageId) => {
    try {
        const response = await api.delete(`/product-images/${imageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const setPrimaryImage = async (imageId) => {
    try {
        const response = await api.put(`/product-images/${imageId}/set-primary`);
        return response.data;
    } catch (error) {
        throw error;
    }
};



// src/api/productImageService.js
// Улучшаем функцию загрузки файла с более подробной обработкой ошибок

const uploadProductImage = async (file, productId, metadata = {}) => {
    try {
      // Создаем объект FormData для загрузки файла
      const formData = new FormData();
      formData.append('file', file);
      formData.append('product_id', productId);
      
      // Добавляем метаданные
      if (metadata.alt_text) formData.append('alt_text', metadata.alt_text);
      formData.append('is_primary', metadata.is_primary ? 'true' : 'false');
      formData.append('display_order', metadata.display_order || 0);
      
      console.log('Отправляем запрос на загрузку изображения:', {
        productId,
        fileName: file.name,
        fileSize: file.size,
        metadata
      });
      
      // Отправляем запрос
      const response = await api.post('/product-images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Успешно загружено изображение:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      console.error('Сообщение ошибки:', error.message);
      if (error.response) {
        console.error('Ответ сервера:', error.response.data);
        console.error('Статус ответа:', error.response.status);
      }
      // Преобразуем ошибку в строку с дополнительной информацией
      throw new Error(`Ошибка загрузки: ${error.message}`);
    }
  };
  
  // Обновленный экспорт сервиса
  const productImageService = {
    getProductImages,
    getProductImage,
    createProductImage,
    updateProductImage,
    deleteProductImage,
    setPrimaryImage,
    uploadProductImage // Добавляем новую функцию
  };


export default productImageService;