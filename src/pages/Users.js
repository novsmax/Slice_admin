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
    FormHelperText,
    Chip,
    Alert,
    CircularProgress,
    InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Search as SearchIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import userService from '../api/userService';
import roleService from '../api/roleService';

const UsersPage = () => {
    const { currentUser } = useAuth();
    
    // Состояние для списка пользователей и пагинации
    const [users, setUsers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Состояние для списка ролей
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    
    // Состояние для поиска и фильтрации
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    
    // Состояние для модальных окон
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentUser2, setCurrentUser2] = useState(null);
    
    // Состояние для валидации формы
    const [formErrors, setFormErrors] = useState({});
    
    // Состояние для формы пользователя
    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        full_name: '',
        password: '',
        role_id: '',
        is_active: true
    });
    
    // Загрузка пользователей
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await userService.getUsers(
                page + 1,
                rowsPerPage,
                searchQuery,
                roleFilter || null
            );
            
            setUsers(data.items);
            setTotalItems(data.total);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Не удалось загрузить список пользователей');
        } finally {
            setLoading(false);
        }
    };
    
    // Загрузка ролей
    const fetchRoles = async () => {
        try {
            setLoadingRoles(true);
            
            const roles = await roleService.getAllRoles();
            setRoles(roles);
        } catch (err) {
            console.error('Error fetching roles:', err);
            setError('Не удалось загрузить список ролей');
        } finally {
            setLoadingRoles(false);
        }
    };
    
    // При монтировании компонента загружаем роли
    useEffect(() => {
        fetchRoles();
    }, []);
    
    // При изменении страницы, размера страницы или фильтров загружаем пользователей
    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage, searchQuery, roleFilter]);
    
    // Обработчики изменения пагинации
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    // Обработчики поиска и фильтрации
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };
    
    const handleRoleFilterChange = (event) => {
        setRoleFilter(event.target.value);
        setPage(0);
    };
    
    // Обработчики формы
    const handleFormChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : value
        });
        
        // Очищаем ошибку поля при изменении
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: null
            });
        }
    };
    
    // Очистка формы
    const resetForm = () => {
        setFormValues({
            username: '',
            email: '',
            full_name: '',
            password: '',
            role_id: '',
            is_active: true
        });
        setFormErrors({});
    };
    
    // Валидация формы
    const validateForm = () => {
        const errors = {};
        
        if (!formValues.username.trim()) {
            errors.username = 'Имя пользователя обязательно';
        } else if (formValues.username.length < 3) {
            errors.username = 'Имя пользователя должно содержать не менее 3 символов';
        }
        
        if (!formValues.email.trim()) {
            errors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
            errors.email = 'Некорректный формат Email';
        }
        
        if (openAddDialog && !formValues.password) {
            errors.password = 'Пароль обязателен при создании пользователя';
        } else if (formValues.password && formValues.password.length < 8) {
            errors.password = 'Пароль должен содержать не менее 8 символов';
        } else if (formValues.password && !/[A-Z]/.test(formValues.password)) {
            errors.password = 'Пароль должен содержать хотя бы одну заглавную букву';
        } else if (formValues.password && !/[a-z]/.test(formValues.password)) {
            errors.password = 'Пароль должен содержать хотя бы одну строчную букву';
        } else if (formValues.password && !/[0-9]/.test(formValues.password)) {
            errors.password = 'Пароль должен содержать хотя бы одну цифру';
        }
        
        if (!formValues.role_id) {
            errors.role_id = 'Роль пользователя обязательна';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    // Открытие модального окна добавления
    const handleOpenAddDialog = () => {
        resetForm();
        setOpenAddDialog(true);
    };
    
    // Открытие модального окна редактирования
    const handleOpenEditDialog = (user) => {
        setCurrentUser2(user);
        setFormValues({
            username: user.username,
            email: user.email,
            full_name: user.full_name || '',
            password: '', // Пустой пароль - не будет обновлен, если не заполнен
            role_id: user.role_id,
            is_active: user.is_active
        });
        setOpenEditDialog(true);
    };
    
    // Открытие модального окна удаления
    const handleOpenDeleteDialog = (user) => {
        setCurrentUser2(user);
        setOpenDeleteDialog(true);
    };
    
    // Закрытие всех модальных окон
    const handleCloseDialogs = () => {
        setOpenAddDialog(false);
        setOpenEditDialog(false);
        setOpenDeleteDialog(false);
        setCurrentUser2(null);
    };
    
    // Добавление пользователя
    const handleAddUser = async () => {
        if (!validateForm()) {
            return;
        }
        
        try {
            setLoading(true);
            
            await userService.createUser(formValues);
            handleCloseDialogs();
            fetchUsers();
        } catch (err) {
            console.error('Error adding user:', err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Не удалось добавить пользователя');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Редактирование пользователя
    const handleEditUser = async () => {
        if (!validateForm()) {
            return;
        }
        
        try {
            setLoading(true);
            
            // Если пароль пустой, удаляем его из запроса
            const userData = { ...formValues };
            if (!userData.password) {
                delete userData.password;
            }
            
            await userService.updateUser(currentUser2.id, userData);
            handleCloseDialogs();
            fetchUsers();
        } catch (err) {
            console.error('Error updating user:', err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Не удалось обновить пользователя');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Удаление пользователя
    const handleDeleteUser = async () => {
        try {
            setLoading(true);
            
            await userService.deleteUser(currentUser2.id);
            handleCloseDialogs();
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Не удалось удалить пользователя');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Получение информации о роли по ID
    const getRoleNameById = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.name : 'Неизвестная роль';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Управление пользователями
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddDialog}
                >
                    Добавить пользователя
                </Button>
            </Box>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            {/* Фильтры */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Поиск пользователей"
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
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Роль</InputLabel>
                        <Select
                            value={roleFilter}
                            onChange={handleRoleFilterChange}
                            label="Роль"
                        >
                            <MenuItem value="">Все роли</MenuItem>
                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Paper>
            
            {/* Таблица пользователей */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Имя пользователя</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Полное имя</TableCell>
                                <TableCell>Роль</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Дата создания</TableCell>
                                <TableCell>Последний вход</TableCell>
                                <TableCell align="right">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        Пользователи не найдены
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.full_name || '-'}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={user.role ? user.role.name : getRoleNameById(user.role_id)} 
                                                color={user.role && user.role.is_admin ? "primary" : "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.is_active ? 'Активен' : 'Заблокирован'}
                                                color={user.is_active ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {user.last_login 
                                                ? new Date(user.last_login).toLocaleDateString() 
                                                : 'Нет данных'}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Редактировать">
                                                <IconButton 
                                                    onClick={() => handleOpenEditDialog(user)}
                                                    disabled={user.id === currentUser.id} // Запрет редактирования себя
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Удалить">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleOpenDeleteDialog(user)}
                                                    disabled={user.id === currentUser.id} // Запрет удаления себя
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
                    labelRowsPerPage="Пользователей на странице:"
                />
            </Paper>
            
            {/* Диалог добавления пользователя */}
            <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
                <DialogTitle>Добавить нового пользователя</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Имя пользователя"
                        name="username"
                        fullWidth
                        value={formValues.username}
                        onChange={handleFormChange}
                        error={!!formErrors.username}
                        helperText={formErrors.username}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        value={formValues.email}
                        onChange={handleFormChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Полное имя"
                        name="full_name"
                        fullWidth
                        value={formValues.full_name}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        label="Пароль"
                        name="password"
                        type="password"
                        fullWidth
                        value={formValues.password}
                        onChange={handleFormChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        required
                    />
                    <FormControl fullWidth margin="dense" error={!!formErrors.role_id} required>
                        <InputLabel>Роль пользователя</InputLabel>
                        <Select
                            name="role_id"
                            value={formValues.role_id}
                            onChange={handleFormChange}
                            label="Роль пользователя"
                        >
                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                    {role.name} {role.is_admin ? '(Администратор)' : ''}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.role_id && <FormHelperText>{formErrors.role_id}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <label>
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formValues.is_active}
                                onChange={handleFormChange}
                            />
                            &nbsp;Пользователь активен
                        </label>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs}>Отмена</Button>
                    <Button 
                        onClick={handleAddUser} 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Добавить'}
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Диалог редактирования пользователя */}
            <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
                <DialogTitle>Редактировать пользователя</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Имя пользователя"
                        name="username"
                        fullWidth
                        value={formValues.username}
                        onChange={handleFormChange}
                        error={!!formErrors.username}
                        helperText={formErrors.username}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        value={formValues.email}
                        onChange={handleFormChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Полное имя"
                        name="full_name"
                        fullWidth
                        value={formValues.full_name}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        label="Новый пароль (оставьте пустым, чтобы не менять)"
                        name="password"
                        type="password"
                        fullWidth
                        value={formValues.password}
                        onChange={handleFormChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password || 'Оставьте пустым, чтобы не менять пароль'}
                    />
                    <FormControl fullWidth margin="dense" error={!!formErrors.role_id} required>
                        <InputLabel>Роль пользователя</InputLabel>
                        <Select
                            name="role_id"
                            value={formValues.role_id}
                            onChange={handleFormChange}
                            label="Роль пользователя"
                        >
                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                    {role.name} {role.is_admin ? '(Администратор)' : ''}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.role_id && <FormHelperText>{formErrors.role_id}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <label>
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formValues.is_active}
                                onChange={handleFormChange}
                            />
                            &nbsp;Пользователь активен
                        </label>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs}>Отмена</Button>
                    <Button 
                        onClick={handleEditUser} 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Сохранить'}
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Диалог удаления пользователя */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialogs}>
                <DialogTitle>Удалить пользователя</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы действительно хотите удалить пользователя <b>{currentUser2?.username}</b>? Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs}>Отмена</Button>
                    <Button 
                        onClick={handleDeleteUser} 
                        variant="contained" 
                        color="error"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersPage;