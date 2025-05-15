// src/pages/AccessDenied.js
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3)
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 500
}));

const AccessDenied = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutAndRedirect = () => {
    // Сначала выполняем выход из системы
    logout();
    // Затем перенаправляем на страницу логина
    navigate('/login');
  };

  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom color="error">
          Доступ запрещен
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          У вас нет прав доступа к административной панели. 
          Эта часть сайта доступна только для администраторов и менеджеров.
        </Typography>
        <Button
          onClick={handleLogoutAndRedirect}
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Вернуться на страницу входа
        </Button>
      </StyledPaper>
    </StyledContainer>
  );
};

export default AccessDenied;