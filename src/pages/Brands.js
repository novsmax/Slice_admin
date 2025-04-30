// src/pages/Brands.js
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
    Alert,
    CircularProgress,
    Grid,
    Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Search as SearchIcon } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import brandService from '../api/brandService';

const BrandsPage = () => {
    // Состояние для списка брендов и пагинации
    const [brands, setBrands] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Состояние для поиска
    const [searchQuery, setSearchQuery] = useState('');

    // Состояние для модальных окон
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentBrand, setCurrentBrand] = useState(null);

    // Состояние для формы бренда
    const [formValues, setFormValues] = useState({
        name: '',
        description: '',
        logo_url: ''
    });

    // Загрузка брендов
    const fetchBrands = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await brandService.getBrands(
                page + 1,
                rowsPerPage,
                searchQuery
            );

            setBrands(data.items);
            setTotalItems(data.total);
        } catch (err) {
            console.error('Error fetching brands:', err);
            setError('Не удалось загрузить список брендов');
        } finally {
            setLoading(false);
        }
    };

    // При изменении страницы, размера страницы или поискового запроса загружаем бренды
    useEffect(() => {
        fetchBrands();
    }, [page, rowsPerPage, searchQuery]);

    // Обработчики изменения пагинации
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Обработчики поиска
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    // Обработчики формы
    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    // Очистка формы
    const resetForm = () => {
        setFormValues({
            name: '',
            description: '',
            logo_url: ''
        });
    };

    // Открытие модального окна добавления
    const handleOpenAddDialog = () => {
        resetForm();
        setOpenAddDialog(true);
    };

    // Открытие модального окна редактирования
    const handleOpenEditDialog = (brand) => {
        setCurrentBrand(brand);
        setFormValues({
            name: brand.name,
            description: brand.description || '',
            logo_url: brand.logo_url || ''
        });
        setOpenEditDialog(true);
    };

    // Открытие модального окна удаления
    const handleOpenDeleteDialog = (brand) => {
        setCurrentBrand(brand);
        setOpenDeleteDialog(true);
    };

    // Закрытие всех модальных окон
    const handleCloseDialogs = () => {
        setOpenAddDialog(false);
        setOpenEditDialog(false);
        setOpenDeleteDialog(false);
        setCurrentBrand(null);
    };

    // Добавление бренда
    const handleAddBrand = async () => {
        try {
            setLoading(true);

            await brandService.createBrand(formValues);
            handleCloseDialogs();
            fetchBrands();
        } catch (err) {
            console.error('Error adding brand:', err);
            setError('Не удалось добавить бренд');
        } finally {
            setLoading(false);
        }
    };

    // Редактирование бренда
    const handleEditBrand = async () => {
        try {
            setLoading(true);

            await brandService.updateBrand(currentBrand.id, formValues);
            handleCloseDialogs();
            fetchBrands();
        } catch (err) {
            console.error('Error updating brand:', err);
            setError('Не удалось обновить бренд');
        } finally {
            setLoading(false);
        }
    };

    // Удаление бренда
    const handleDeleteBrand = async () => {
        try {
            setLoading(true);

            await brandService.deleteBrand(currentBrand.id);
            handleCloseDialogs();
            fetchBrands();
        } catch (err) {
            console.error('Error deleting brand:', err);
            setError('Не удалось удалить бренд');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Управление брендами
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddDialog}
                >
                    Добавить бренд
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Поиск */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    label="Поиск брендов"
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
            </Paper>

            {/* Таблица брендов */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Логотип</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Описание</TableCell>
                                <TableCell>Дата создания</TableCell>
                                <TableCell align="right">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && brands.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : brands.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Бренды не найдены
                                    </TableCell>
                                </TableRow>
                            ) : (
                                brands.map((brand) => (
                                    <TableRow key={brand.id}>
                                        <TableCell>{brand.id}</TableCell>
                                        <TableCell>
                                            {brand.logo_url ? (
                                                <Avatar
                                                    src={brand.logo_url}
                                                    alt={brand.name}
                                                    sx={{ width: 40, height: 40 }}
                                                />
                                            ) : (
                                                <Avatar sx={{ width: 40, height: 40 }}>
                                                    {brand.name?.charAt(0)?.toUpperCase() || 'B'}
                                                </Avatar>
                                            )}
                                        </TableCell>
                                        <TableCell>{brand.name}</TableCell>
                                        <TableCell>{brand.description || '—'}</TableCell>
                                        <TableCell>
                                            {new Date(brand.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Редактировать">
                                                <IconButton onClick={() => handleOpenEditDialog(brand)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Удалить">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleOpenDeleteDialog(brand)}
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
                    labelRowsPerPage="Брендов на странице:"
                />
            </Paper>

            {/* Диалог добавления бренда */}
            <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
                <DialogTitle>Добавить новый бренд</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                required
                                fullWidth
                                name="name"
                                label="Название бренда"
                                value={formValues.name}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="description"
                                label="Описание бренда"
                                multiline
                                rows={3}
                                value={formValues.description}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="logo_url"
                                label="URL логотипа"
                                placeholder="https://example.com/logos/brand-logo.png"
                                value={formValues.logo_url}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        {formValues.logo_url && (
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ mt: 1, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Предварительный просмотр:
                                    </Typography>
                                    <Avatar
                                        src={formValues.logo_url}
                                        alt={formValues.name}
                                        sx={{ width: 80, height: 80, margin: '0 auto' }}
                                    />
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs} color="inherit">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleAddBrand}
                        color="primary"
                        variant="contained"
                        disabled={loading || !formValues.name}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Добавить'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог редактирования бренда */}
            <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
                <DialogTitle>Редактировать бренд</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                required
                                fullWidth
                                name="name"
                                label="Название бренда"
                                value={formValues.name}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="description"
                                label="Описание бренда"
                                multiline
                                rows={3}
                                value={formValues.description}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="logo_url"
                                label="URL логотипа"
                                placeholder="https://example.com/logos/brand-logo.png"
                                value={formValues.logo_url}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        {formValues.logo_url && (
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ mt: 1, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Предварительный просмотр:
                                    </Typography>
                                    <Avatar
                                        src={formValues.logo_url}
                                        alt={formValues.name}
                                        sx={{ width: 80, height: 80, margin: '0 auto' }}
                                    />
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs} color="inherit">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleEditBrand}
                        color="primary"
                        variant="contained"
                        disabled={loading || !formValues.name}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Сохранить'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог удаления бренда */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialogs}>
                <DialogTitle>Удалить бренд</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы действительно хотите удалить бренд "{currentBrand?.name}"? Это действие может повлиять на товары, привязанные к этому бренду.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs} color="inherit">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleDeleteBrand}
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

export default BrandsPage;