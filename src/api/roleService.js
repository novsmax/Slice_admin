import { api } from './authService';

const getRoles = async (page = 1, perPage = 100) => {
    try {
        const response = await api.get(`/roles?page=${page}&per_page=${perPage}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getRole = async (id) => {
    try {
        const response = await api.get(`/roles/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createRole = async (roleData) => {
    try {
        const response = await api.post('/roles', roleData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateRole = async (id, roleData) => {
    try {
        const response = await api.put(`/roles/${id}`, roleData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteRole = async (id) => {
    try {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const roleService = {
    getRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole
};

export default roleService;