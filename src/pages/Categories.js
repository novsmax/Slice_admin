// src/pages/Categories.js
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
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Search as SearchIcon } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import categoryService from '../api/categoryService';

const CategoriesPage = () => {
    // Состояние для списка категорий и пагинации
    const [categories, setCategories] = useState([]);
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
    const [currentCategory, setCurrentCategory] = useState(null);

    // Состояние для формы категории
    const [formValues, setFormValues] = useState({
        name: '',
        description: ''
    });

    // Загрузка категорий
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await categoryService.getCategories(
                page + 1,
                rowsPerPage,
                searchQuery
            );

            setCategories(data.items);
            setTotalItems(data.total);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Не удалось загрузить список категорий');
        } finally {
            setLoading(false);
        }
    };

    // При изменении страницы, размера страницы или поискового запроса загружаем категории
    useEffect(() => {
        fetchCategories();
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
            description: ''
        });
    };

    // Открытие модального окна добавления
    const handleOpenAddDialog = () => {
        resetForm();
        setOpenAddDialog(true);
    };

    // Открытие модального окна редактирования
    const handleOpenEditDialog = (category) => {
        setCurrentCategory(category);
        setFormValues({
            name: category.name,
            description: category.description || ''
        });
        setOpenEditDialog(true);
    };

    // Открытие модального окна удаления
    const handleOpenDeleteDialog = (category) => {
        setCurrentCategory(category);
        setOpenDeleteDialog(true);
    };

    // Закрытие всех модальных окон
    const handleCloseDialogs = () => {
        setOpenAddDialog(false);
        setOpenEditDialog(false);
        setOpenDeleteDialog(false);
        setCurrentCategory(null);
    };

    // Добавление категории
    const handleAddCategory = async () => {
        try {
            setLoading(true);

            await categoryService.createCategory(formValues);
            handleCloseDialogs();
            fetchCategories();
        } catch (err) {
            console.error('Error adding category:', err);
            setError('Не удалось добавить категорию');
        } finally {
            setLoading(false);
        }
    };

    // Редактирование категории
    const handleEditCategory = async () => {
        try {
            setLoading(true);

            await categoryService.updateCategory(currentCategory.id, formValues);
            handleCloseDialogs();
            fetchCategories();
        } catch (err) {
            console.error('Error updating category:', err);
            setError('Не удалось обновить категорию');
        } finally {
            setLoading(false);
        }
    };

    // Удаление категории
    const handleDeleteCategory = async () => {
        try {
            setLoading(true);

            await categoryService.deleteCategory(currentCategory.id);
            handleCloseDialogs();
            fetchCategories();
        } catch (err) {
            console.error('Error deleting category:', err);
            setError('Не удалось удалить категорию');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Управление категориями
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddDialog}
                >
                    Добавить категорию
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
                    label="Поиск категорий"
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

            {/* Таблица категорий */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Описание</TableCell>
                                <TableCell>Дата создания</TableCell>
                                <TableCell align="right">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Категории не найдены
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.id}</TableCell>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.description || '—'}</TableCell>
                                        <TableCell>
                                            {new Date(category.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Редактировать">
                                                <IconButton onClick={() => handleOpenEditDialog(category)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Удалить">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleOpenDeleteDialog(category)}
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
                    labelRowsPerPage="Категорий на странице:"
                />
            </Paper>

            {/* Диалог добавления категории */}
            <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
                <DialogTitle>Добавить новую категорию</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Название категории"
                        type="text"
                        fullWidth
                        required
                        value={formValues.name}
                        onChange={handleFormChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Описание категории"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={formValues.description}
                        onChange={handleFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs} color="inherit">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleAddCategory}
                        color="primary"
                        variant="contained"
                        disabled={loading || !formValues.name}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Добавить'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог редактирования категории */}
            <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
                <DialogTitle>Редактировать категорию</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Название категории"
                        type="text"
                        fullWidth
                        required
                        value={formValues.name}
                        onChange={handleFormChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Описание категории"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={formValues.description}
                        onChange={handleFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs} color="inherit">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleEditCategory}
                        color="primary"
                        variant="contained"
                        disabled={loading || !formValues.name}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Сохранить'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог удаления категории */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialogs}>
                <DialogTitle>Удалить категорию</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы действительно хотите удалить категорию "{currentCategory?.name}"? Это действие может повлиять на товары, привязанные к этой категории.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs} color="inherit">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleDeleteCategory}
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

export default CategoriesPage;