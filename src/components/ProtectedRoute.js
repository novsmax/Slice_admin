// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// Компонент для защиты маршрутов, требующих аутентификации
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { currentUser, loading, isAdmin } = useAuth();
    const location = useLocation();

    // Пока проверяем состояние аутентификации, показываем лоадер
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Если пользователь не аутентифицирован, перенаправляем на страницу логина
    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Если требуются права администратора, проверяем их
    if (adminOnly && !isAdmin()) {
        // Перенаправляем на дашборд с сообщением о недостаточных правах
        return <Navigate to="/dashboard" state={{
            error: "У вас недостаточно прав для доступа к этой странице"
        }} replace />;
    }

    // Если всё в порядке, отображаем содержимое защищенного маршрута
    return children;
};

export default ProtectedRoute;