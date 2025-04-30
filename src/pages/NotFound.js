import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const NotFoundContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: theme.spacing(3)
}));

const NotFoundPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 500
}));

const NotFound = () => {
    return (
        <NotFoundContainer>
            <NotFoundPaper elevation={3}>
                <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: 100, color: 'primary.main' }}>
                    404
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom align="center">
                    Страница не найдена
                </Typography>
                <Typography variant="body1" align="center" paragraph>
                    Запрашиваемая страница не существует или была перемещена.
                </Typography>
                <Button
                    component={Link}
                    to="/dashboard"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 2 }}
                >
                    Вернуться на главную
                </Button>
            </NotFoundPaper>
        </NotFoundContainer>
    );
};

export default NotFound;