// src/api/categoryService.js
import { api } from './authService';

const getCategories = async (page = 1, perPage = 20, search = '') => {
    try {
        let url = `/categories?page=${page}&per_page=${perPage}`;

        if (search) url += `&query=${encodeURIComponent(search)}`;

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getCategory = async (id) => {
    try {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createCategory = async (categoryData) => {
    try {
        const response = await api.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateCategory = async (id, categoryData) => {
    try {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const categoryService = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};

export default categoryService;