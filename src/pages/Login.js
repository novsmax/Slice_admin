// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const StyledLockIcon = styled(Box)(({ theme }) => ({
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
}));

const StyledForm = styled('form')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(1),
}));

const StyledSubmitButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    const { login, currentUser, loading, error } = useAuth();
    const navigate = useNavigate();

    // Если пользователь уже авторизован, перенаправляем на дашборд
    if (currentUser) {
        return <Navigate to="/dashboard" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            setFormError('Введите имя пользователя');
            return;
        }

        if (!password) {
            setFormError('Введите пароль');
            return;
        }

        setFormError('');
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            // Ошибка уже будет установлена в контексте Auth
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <StyledPaper elevation={3}>
                <StyledLockIcon>
                    <LockOutlinedIcon />
                </StyledLockIcon>
                <Typography component="h1" variant="h5">
                    Вход в админ-панель Slice
                </Typography>

                {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                {formError && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{formError}</Alert>}

                <StyledForm onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Имя пользователя"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <StyledSubmitButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Войти'}
                    </StyledSubmitButton>
                </StyledForm>
            </StyledPaper>
        </Container>
    );
};

export default Login;