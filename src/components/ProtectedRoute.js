import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, loading, isAdmin, isManager, hasAdminAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Проверка аутентификации
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Проверка доступа к админке (независимо от того, требуется ли админ)
  // Только администраторы и менеджеры могут войти в админ-панель
  if (!hasAdminAccess()) {
    console.log('Access denied: User does not have admin or manager role');
    return <Navigate to="/access-denied" replace />;
  }

  // Дополнительная проверка для разделов, требующих прав администратора
  if (requireAdmin && !isAdmin()) {
    console.log('Access denied: This section requires admin privileges');
    return <Navigate to="/access-denied" replace />;
  }

  // Если все проверки пройдены, отображаем содержимое
  return children;
};

export default ProtectedRoute;