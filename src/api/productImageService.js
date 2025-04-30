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

const productImageService = {
    getProductImages,
    getProductImage,
    createProductImage,
    updateProductImage,
    deleteProductImage,
    setPrimaryImage
};

export default productImageService;