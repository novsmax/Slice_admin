// src/api/brandService.js
import { api } from './authService';

const getBrands = async (page = 1, perPage = 20, search = '') => {
    try {
        let url = `/brands?page=${page}&per_page=${perPage}`;

        if (search) url += `&query=${encodeURIComponent(search)}`;

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBrand = async (id) => {
    try {
        const response = await api.get(`/brands/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createBrand = async (brandData) => {
    try {
        const response = await api.post('/brands', brandData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateBrand = async (id, brandData) => {
    try {
        const response = await api.put(`/brands/${id}`, brandData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteBrand = async (id) => {
    try {
        const response = await api.delete(`/brands/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const brandService = {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand
};

export default brandService;