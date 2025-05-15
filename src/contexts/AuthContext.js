// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

// Создание контекста аутентификации
const AuthContext = createContext(null);

// Компонент провайдера аутентификации
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка пользователя при инициализации
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Функция логина
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.login(username, password);
      setCurrentUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при входе в систему');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Функция выхода
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Проверка роли администратора
  const isAdmin = () => {
    // Используем текущего пользователя из состояния компонента вместо вызова getCurrentUser()
    return currentUser && currentUser.role_id === 5; // admin = 1
  };

  // Проверка роли менеджера
  const isManager = () => {
    // Используем текущего пользователя из состояния компонента вместо вызова getCurrentUser()
    return currentUser && currentUser.role_id === 6; // manager = 2
  };

  // Проверка доступа к админке
  const hasAdminAccess = () => {
    return isAdmin() || isManager();
  };

  // Предоставляем значения контекста
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAdmin,
    isManager,
    hasAdminAccess
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста аутентификации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};