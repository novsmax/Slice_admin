// src/pages/Products.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Tooltip,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Search as SearchIcon } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import productService from '../api/productService';
import categoryService from '../api/categoryService';
import brandService from '../api/brandService';

const ProductsPage = () => {
    // Состояние для списка товаров и пагинации
    const [products, setProducts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Состояние для фильтров и поиска
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');

    // Списки категорий и брендов для фильтров
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // Состояние для модальных окон
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // Состояние для формы товара
    const [formValues, setFormValues] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        sku: '',
        is_active: true,
        category_id: '',
        brand_id: ''
    });

    // Загрузка товаров
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await productService.getProducts(
                page + 1,
                rowsPerPage,
                searchQuery,
                selectedCategory || null,
                selectedBrand || null
            );

            setProducts(data.items);
            setTotalItems(data.total);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Не удалось загрузить список товаров');
        } finally {
            setLoading(false);
        }
    };

    // Загрузка категорий и брендов
    const fetchFilters = async () => {
        try {
            // Загружаем все категории с большим размером страницы
            const categoriesData = await categoryService.getCategories(1, 100);
            setCategories(categoriesData.items);

            // Загружаем все бренды с большим размером страницы
            const brandsData = await brandService.getBrands(1, 100);
            setBrands(brandsData.items);
        } catch (err) {
            console.error('Error fetching filters:', err);
            setError('Не удалось загрузить фильтры');
        }
    };

    // При монтировании компонента загружаем данные
    useEffect(() => {
        fetchFilters();
    }, []);

    // При изменении страницы, размера страницы или фильтров загружаем товары
    useEffect(() => {
        fetchProducts();
    }, [page, rowsPerPage, searchQuery, selectedCategory, selectedBrand]);

    // Обработчики изменения пагинации
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Обработчики фильтрации
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setPage(0);
    };

    const handleBrandChange = (event) => {
        setSelectedBrand(event.target.value);
        setPage(0);
    };

    // Обработчики формы
    const handleFormChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Очистка формы
    const resetForm = () => {
        setFormValues({
            name: '',
            description: '',
            price: '',
            stock: '',
            sku: '',
            is_active: true,
            category_id: '',
            brand_id: ''
        });
    };

    // Открытие модального окна добавления
    const handleOpenAddDialog = () => {
        resetForm();
        setOpenAddDialog(true);
    };

    // Открытие модального окна редактирования
    const handleOpenEditDialog = (product) => {
        setCurrentProduct(product);
        setFormValues({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            sku: product.sku || '',
            is_active: product.is_active,
            category_id: product.category_id || '',
            brand_id: product.brand_id || ''
        });
        setOpenEditDialog(true);
    };

    // Открытие модального окна удаления
    const handleOpenDeleteDialog = (product) => {
        setCurrentProduct(product);
        setOpenDeleteDialog(true);
    };

    // Закрытие всех модальных окон
    const handleCloseDialogs = () => {
        setOpenAddDialog(false);
        setOpenEditDialog(false);
        setOpenDeleteDialog(false);
        setCurrentProduct(null);
    };

    // Добавление товара
    const handleAddProduct = async () => {
        try {
            setLoading(true);

            // Конвертируем значения
            const productData = {
                ...formValues,
                price: parseFloat(formValues.price),
                stock: parseInt(formValues.stock, 10),
                category_id: formValues.category_id || null,
                brand_id: formValues.brand_id || null
            };

            await productService.createProduct(productData);
            handleCloseDialogs();
            fetchProducts();
        } catch (err) {
            console.error('Error adding product:', err);
            setError('Не удалось добавить товар');
        } finally {
            setLoading(false);
        }
    };

    // Редактирование товара
    const handleEditProduct = async () => {
        try {
            setLoading(true);

            // Конвертируем значения
            const productData = {
                ...formValues,
                price: parseFloat(formValues.price),
                stock: parseInt(formValues.stock, 10),
                category_id: formValues.category_id || null,
                brand_id: formValues.brand_id || null
            };

            await productService.updateProduct(currentProduct.id, productData);
            handleCloseDialogs();
            fetchProducts();
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Не удалось обновить товар');
        } finally {
            setLoading(false);
        }
    };

    // Удаление товара
    const handleDeleteProduct = async () => {
        try {
            setLoading(true);

            await productService.deleteProduct(currentProduct.id);
            handleCloseDialogs();
            fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Не удалось удалить товар');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Управление товарами
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddDialog}
                >
                    Добавить товар
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Фильтры */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Поиск товаров"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel>Категория</InputLabel>
                            <Select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                label="Категория"
                            >
                                <MenuItem value="">Все категории</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel>Бренд</InputLabel>
                            <Select
                                value={selectedBrand}
                                onChange={handleBrandChange}
                                label="Бренд"
                            >
                                <MenuItem value="">Все бренды</MenuItem>
                                {brands.map((brand) => (
                                    <MenuItem key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('');
                                setSelectedBrand('');
                            }}
                        >
                            Сбросить
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Таблица товаров */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Цена</TableCell>
                                <TableCell>В наличии</TableCell>
                                <TableCell>Артикул (SKU)</TableCell>
                                <TableCell>Категория</TableCell>
                                <TableCell>Бренд</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell align="right">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        Товары не найдены
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.price.toFixed(2)} ₽</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>{product.sku || '—'}</TableCell>
                                        <TableCell>
                                            {categories.find(c => c.id === product.category_id)?.name || '—'}
                                        </TableCell>
                                        <TableCell>
                                            {brands.find(b => b.id === product.brand_id)?.name || '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.is_active ? 'Активен' : 'Неактивен'}
                                                color={product.is_active ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Редактировать">
                                                <IconButton onClick={() => handleOpenEditDialog(product)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Удалить">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleOpenDeleteDialog(product)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Пагинация */}
                <TablePagination
                    component="div"
                    count={totalItems}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="Товаров на странице:"
                />
            </Paper>

            {/* Диалог добавления товара */}
            <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
                <DialogTitle>Добавить новый товар</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                name="name"
                                label="Название товара"
                                value={formValues.name}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="sku"
                                label="Артикул (SKU)"
                                value={formValues.sku}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                name="price"
                                label="Цена"
                                type="number"
                                value={formValues.price}
                                onChange={handleFormChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₽</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                name="stock"
                                label="Количество на складе"
                                type="number"
                                value={formValues.stock}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Категория</InputLabel>
                                <Select
                                    name="category_id"
                                    value={formValues.category_id}
                                    onChange={handleFormChange}
                                    label="Категория"
                                >
                                    <MenuItem value="">Не выбрано</MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Бренд</InputLabel>
                                <Select
                                    name="brand_id"
                                    value={formValues.brand_id}
                                    onChange={handleFormChange}
                                    label="Бренд"
                                >
                                    <MenuItem value="">Не выбрано</MenuItem>
                                    {brands.map((brand) => (
                                        <MenuItem key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                name="description"
                                label="Описание товара"
                                value={formValues.description}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formValues.is_active}
                                        onChange={handleFormChange}
                                    />
                                    &nbsp;Товар активен (доступен для продажи)
                                </label>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs} color="inherit">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleAddProduct}
                        color="primary"
                        variant="contained"
                        disabled={loading || !formValues.name || !formValues.price}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Добавить'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог редактирования товара */}
            <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
                <DialogTitle>Редактировать товар</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                name="name"
                                label="Название товара"
                                value={formValues.name}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="sku"
                                label="Артикул (SKU)"
                                value={formValues.sku}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                name="price"
                                label="Цена"
                                type="number"
                                value={formValues.price}
                                onChange={handleFormChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₽</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                name="stock"
                                label="Количество на складе"
                                type="number"
                                value={formValues.stock}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Категория</InputLabel>
                                <Select
                                    name="category_id"
                                    value={formValues.category_id}
                                    onChange={handleFormChange}
                                    label="Категория"
                                >
                                    <MenuItem value="">Не выбрано</MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Бренд</InputLabel>
                                <Select
                                    name="brand_id"
                                    value={formValues.brand_id}
                                    onChange={handleFormChange}
                                    label="Бренд"
                                >
                                    <MenuItem value="">Не выбрано</MenuItem>
                                    {brands.map((brand) => (
                                        <MenuItem key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                name="description"
                                label="Описание товара"
                                value={formValues.description}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formValues.is_active}
                                        onChange={handleFormChange}
                                    />
                                    &nbsp;Товар активен (доступен для продажи)
                                </label>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs} color="inherit">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleEditProduct}
                        color="primary"
                        variant="contained"
                        disabled={loading || !formValues.name || !formValues.price}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Сохранить'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог удаления товара */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialogs}>
                <DialogTitle>Удалить товар</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы действительно хотите удалить товар "{currentProduct?.name}"? Это действие невозможно отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs} color="inherit">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleDeleteProduct}
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductsPage;