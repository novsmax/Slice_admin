// src/api/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

// Создаем экземпляр axios с настройками
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Перехватчик для добавления токена к запросам
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Перехватчик для обработки ошибок (в т.ч. истечения токена)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Автоматический выход при истечении срока действия токена
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Аутентификация
const login = async (username, password) => {
    try {
        // Отправляем запрос на логин в формате, который ожидает FastAPI с OAuth2
        const response = await axios.post(`${API_URL}/auth/login`,
            new URLSearchParams({
                'username': username,
                'password': password
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

// Выход из системы
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Получение данных текущего пользователя
const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
};

// Проверка, залогинен ли пользователь и имеет ли права администратора
const isAdmin = () => {
    const user = getCurrentUser();
    return user && user.role && user.role.is_admin;
};

// Экспортируем API и функции аутентификации
export { api };

const authService = {
    login,
    logout,
    getCurrentUser,
    isAdmin,
};

export default authService;