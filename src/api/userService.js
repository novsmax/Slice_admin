import { api } from './authService';

const getUsers = async (page = 1, perPage = 10, query = '', roleId = null) => {
    try {
        let url = `/users?page=${page}&per_page=${perPage}`;

        if (query) url += `&query=${encodeURIComponent(query)}`;
        if (roleId) url += `&role_id=${roleId}`;

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getUser = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const userService = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};

export default userService;