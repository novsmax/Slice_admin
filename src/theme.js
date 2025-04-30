// src/theme.js
import { createTheme } from '@mui/material/styles';

// Создаем тему для Slice Admin
const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5', // Синий (Indigo)
            light: '#757de8',
            dark: '#002984',
            contrastText: '#fff',
        },
        secondary: {
            main: '#f50057', // Розовый
            light: '#ff5983',
            dark: '#bb002f',
            contrastText: '#fff',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        error: {
            main: '#f44336', // Красный
        },
        warning: {
            main: '#ff9800', // Оранжевый
        },
        info: {
            main: '#2196f3', // Голубой
        },
        success: {
            main: '#4caf50', // Зеленый
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        h1: {
            fontWeight: 500,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 500,
            fontSize: '2.2rem',
        },
        h3: {
            fontWeight: 500,
            fontSize: '1.9rem',
        },
        h4: {
            fontWeight: 500,
            fontSize: '1.6rem',
        },
        h5: {
            fontWeight: 500,
            fontSize: '1.3rem',
        },
        h6: {
            fontWeight: 500,
            fontSize: '1.1rem',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiCardHeader: {
            styleOverrides: {
                root: {
                    padding: '16px 24px',
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '16px 24px',
                    '&:last-child': {
                        paddingBottom: 16,
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 500,
                    backgroundColor: '#f5f5f5',
                },
            },
        },
    },
});

export default theme;