import { api } from './authService';

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

// Убедимся, что метод получения всех ролей работает правильно
const getAllRoles = async () => {
  try {
    const response = await api.get('/roles?per_page=100'); // Получаем большое количество ролей (все)
    return response.data.items; // Обратите внимание, что роли находятся в свойстве items объекта ответа
  } catch (error) {
    console.error('Error fetching roles:', error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
};

const roleService = {
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getAllRoles // Не забудьте экспортировать этот метод
};

export default roleService;