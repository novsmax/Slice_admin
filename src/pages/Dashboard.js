// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    ShoppingCart as ShoppingCartIcon,
    Category as CategoryIcon,
    Storefront as StorefrontIcon,
    Image as ImageIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import productService from '../api/productService';
import categoryService from '../api/categoryService';
import brandService from '../api/brandService';

const StyledIcon = styled(Box)(({ theme, color }) => ({
    backgroundColor: color || theme.palette.primary.main,
    color: 'white',
    borderRadius: '50%',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    marginRight: theme.spacing(2)
}));

const StatCard = ({ title, value, icon, color, loading }) => (
    <Card elevation={3}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', py: 3 }}>
            <StyledIcon color={color}>
                {icon}
            </StyledIcon>
            <Box>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>
                <Typography variant="h5" component="div">
                    {loading ? <CircularProgress size={24} /> : value}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalBrands: 0,
        recentProducts: []
    });

    // Загрузка статистики
    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);

            // Загружаем продукты
            const productsData = await productService.getProducts(1, 5);
            const totalProducts = productsData.total;
            const recentProducts = productsData.items;

            // Загружаем категории
            const categoriesData = await categoryService.getCategories(1, 1);
            const totalCategories = categoriesData.total;

            // Загружаем бренды
            const brandsData = await brandService.getBrands(1, 1);
            const totalBrands = brandsData.total;

            setStats({
                totalProducts,
                totalCategories,
                totalBrands,
                recentProducts
            });
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError('Не удалось загрузить статистику');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Панель управления
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4 }}>
                Добро пожаловать, {currentUser?.full_name || currentUser?.username}!
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Статистика */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Всего товаров"
                        value={stats.totalProducts}
                        icon={<ShoppingCartIcon />}
                        color="#4caf50"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Категории"
                        value={stats.totalCategories}
                        icon={<CategoryIcon />}
                        color="#ff9800"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Бренды"
                        value={stats.totalBrands}
                        icon={<StorefrontIcon />}
                        color="#2196f3"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Изображения"
                        value="-"
                        icon={<ImageIcon />}
                        color="#9c27b0"
                        loading={loading}
                    />
                </Grid>
            </Grid>

            {/* Последние товары */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Последние добавленные товары
                        </Typography>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : stats.recentProducts.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                Товары не найдены
                            </Typography>
                        ) : (
                            <List>
                                {stats.recentProducts.map((product, index) => (
                                    <React.Fragment key={product.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                                primary={product.name}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {product.price.toFixed(2)} ₽
                                                        </Typography>
                                                        {` — ${product.description ? product.description.substring(0, 80) + '...' : 'Без описания'}`}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        {index < stats.recentProducts.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Руководство по использованию
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Добро пожаловать в админ-панель интернет-магазина Slice! Здесь вы можете управлять товарами, категориями, брендами и изображениями.
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Основные разделы:
                        </Typography>
                        <List disablePadding>
                            <ListItem>
                                <StyledIcon color="#4caf50" sx={{ width: 32, height: 32 }}>
                                    <ShoppingCartIcon sx={{ fontSize: 18 }} />
                                </StyledIcon>
                                <ListItemText
                                    primary="Товары"
                                    secondary="Добавление, редактирование и удаление товаров"
                                />
                            </ListItem>
                            <ListItem>
                                <StyledIcon color="#ff9800" sx={{ width: 32, height: 32 }}>
                                    <CategoryIcon sx={{ fontSize: 18 }} />
                                </StyledIcon>
                                <ListItemText
                                    primary="Категории"
                                    secondary="Управление категориями товаров"
                                />
                            </ListItem>
                            <ListItem>
                                <StyledIcon color="#2196f3" sx={{ width: 32, height: 32 }}>
                                    <StorefrontIcon sx={{ fontSize: 18 }} />
                                </StyledIcon>
                                <ListItemText
                                    primary="Бренды"
                                    secondary="Управление брендами товаров"
                                />
                            </ListItem>
                            <ListItem>
                                <StyledIcon color="#9c27b0" sx={{ width: 32, height: 32 }}>
                                    <ImageIcon sx={{ fontSize: 18 }} />
                                </StyledIcon>
                                <ListItemText
                                    primary="Изображения"
                                    secondary="Управление изображениями товаров"
                                />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;