// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, loading, isAdmin, isManager } = useAuth();
  const location = useLocation();

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

  // Проверяем доступ к админке (admin = 1, manager = 2)
  const hasStaffAccess = isAdmin() || isManager();
  
  // Если нет доступа к админке, перенаправляем на страницу запрета доступа
  if (!hasStaffAccess) {
    return <Navigate to="/access-denied" replace />;
  }

  // Если нужны права администратора, но пользователь менеджер
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/access-denied" replace />;
  }

  // Если всё в порядке, отображаем содержимое защищенного маршрута
  return children;
};

export default ProtectedRoute;