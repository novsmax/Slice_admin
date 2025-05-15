// src/pages/ProductImages.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
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
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Search as SearchIcon } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import productService from '../api/productService';
import productImageService from '../api/productImageService';
import FileUpload from '../components/FileUpload';

const ProductImagesPage = () => {
  // Состояние для списка товаров и выбранного товара
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Состояние для изображений выбранного товара
  const [productImages, setProductImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  
  // Состояние для поиска товаров
  const [searchQuery, setSearchQuery] = useState('');
  
  // Состояние для модальных окон
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  
  // Состояние для формы изображения
  const [formValues, setFormValues] = useState({
    image_url: '',
    alt_text: '',
    is_primary: false,
    display_order: 0,
    product_id: ''
  });
  
  // Загрузка товаров
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await productService.getProducts(1, 100, searchQuery);
      setProducts(data.items);
      
      // Если товары загружены, выбираем первый по умолчанию
      if (data.items.length > 0 && !selectedProduct) {
        setSelectedProduct(data.items[0]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Не удалось загрузить список товаров');
    } finally {
      setLoading(false);
    }
  };
  
  // Загрузка изображений выбранного товара
  const fetchProductImages = async (productId) => {
    if (!productId) return;
    
    try {
      setLoadingImages(true);
      
      const data = await productImageService.getProductImages(productId);
      // Сортируем изображения по порядку отображения, затем по основному изображению
      const sortedImages = data.sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return a.display_order - b.display_order;
      });
      
      setProductImages(sortedImages);
    } catch (err) {
      console.error('Error fetching product images:', err);
      setError('Не удалось загрузить изображения товара');
    } finally {
      setLoadingImages(false);
    }
  };
  
  // При монтировании компонента загружаем товары
  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);
  
  // При выборе товара загружаем его изображения
  useEffect(() => {
    if (selectedProduct) {
      fetchProductImages(selectedProduct.id);
    }
  }, [selectedProduct]);
  
  // Обработчики поиска
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Обработчик выбора товара
  const handleProductChange = (event) => {
    const productId = event.target.value;
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
  };
  
  // Обработчики формы
  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Загрузка файла
  const handleFileUpload = async (file) => {
    try {
      if (!selectedProduct) {
        throw new Error('Сначала выберите товар');
      }
      
      console.log('Начинаем загрузку файла:', file.name);
      
      // Загружаем файл с метаданными
      const metadata = {
        alt_text: selectedProduct.name, // По умолчанию используем имя товара
        display_order: productImages.length, // Ставим в конец списка
        is_primary: productImages.length === 0 // Если изображений нет, делаем основным
      };
      
      const result = await productImageService.uploadProductImage(file, selectedProduct.id, metadata);
      console.log('Файл успешно загружен, результат:', result);
      
      // После успешной загрузки обновляем список изображений
      fetchProductImages(selectedProduct.id);
      
      return true;
    } catch (err) {
      // Улучшаем логирование ошибки
      console.error('Детальная ошибка при загрузке файла:', err);
      setError(err.message || 'Не удалось загрузить изображение');
      
      // Возвращаем отклоненный промис с текстовым сообщением
      return Promise.reject(new Error(err.message || 'Ошибка загрузки'));
    }
  };
  
  // Очистка формы
  const resetForm = () => {
    setFormValues({
      image_url: '',
      alt_text: '',
      is_primary: false,
      display_order: 0,
      product_id: selectedProduct ? selectedProduct.id : ''
    });
  };
  
  // Открытие модального окна добавления
  
  // Открытие модального окна редактирования
  const handleOpenEditDialog = (image) => {
    setCurrentImage(image);
    setFormValues({
      image_url: image.image_url,
      alt_text: image.alt_text || '',
      is_primary: image.is_primary,
      display_order: image.display_order,
      product_id: image.product_id
    });
    setOpenEditDialog(true);
  };
  
  // Открытие модального окна удаления
  const handleOpenDeleteDialog = (image) => {
    setCurrentImage(image);
    setOpenDeleteDialog(true);
  };
  
  // Закрытие всех модальных окон
  const handleCloseDialogs = () => {
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setCurrentImage(null);
  };
  
  // Добавление изображения
  
  // Редактирование изображения
  const handleEditImage = async () => {
    try {
      setLoading(true);
      
      // Создаем объект только с изменяемыми полями (исключаем product_id)
      const { product_id, ...updateData } = formValues;
      
      await productImageService.updateProductImage(currentImage.id, updateData);
      handleCloseDialogs();
      fetchProductImages(selectedProduct.id);
    } catch (err) {
      console.error('Error updating image:', err);
      setError('Не удалось обновить изображение');
    } finally {
      setLoading(false);
    }
  };
  
  // Установка изображения как основного
  const handleSetPrimary = async (imageId) => {
    try {
      setLoadingImages(true);
      
      await productImageService.setPrimaryImage(imageId);
      fetchProductImages(selectedProduct.id);
    } catch (err) {
      console.error('Error setting primary image:', err);
      setError('Не удалось установить основное изображение');
    } finally {
      setLoadingImages(false);
    }
  };
  
  // Удаление изображения
  const handleDeleteImage = async () => {
    try {
      setLoading(true);
      
      await productImageService.deleteProductImage(currentImage.id);
      handleCloseDialogs();
      fetchProductImages(selectedProduct.id);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Не удалось удалить изображение');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Управление изображениями товаров
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Выбор товара */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Выберите товар</InputLabel>
              <Select
                value={selectedProduct ? selectedProduct.id : ''}
                onChange={handleProductChange}
                label="Выберите товар"
                disabled={loading || products.length === 0}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Информация о выбранном товаре */}
      {selectedProduct && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h5" gutterBottom>
                {selectedProduct.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedProduct.description || 'Описание отсутствует'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={`Цена: ${selectedProduct.price} ₽`} color="primary" />
                <Chip label={`В наличии: ${selectedProduct.stock} шт.`} />
                {selectedProduct.sku && <Chip label={`SKU: ${selectedProduct.sku}`} />}
              </Box>
            </Grid>
            
            {/* Компонент загрузки файла */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Загрузить новое изображение
              </Typography>
              <FileUpload 
                onFileUpload={handleFileUpload} 
                accept="image/*"
                maxSize={5242880} // 5MB
              />
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Галерея изображений */}
      {selectedProduct && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Изображения товара
          </Typography>
          
          {loadingImages ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : productImages.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              У данного товара нет изображений. Добавьте первое изображение.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {productImages.map((image) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={
                            image.image_url.startsWith('http') 
                            ? image.image_url 
                            : `${window.location.origin}${image.image_url}`
                        }
                        alt={image.alt_text || selectedProduct.name}
                        sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
                    />
                      {image.is_primary && (
                        <Chip
                          label="Основное"
                          color="primary"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                          }}
                        />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {image.alt_text || 'Без описания'}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Порядок отображения: {image.display_order}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      {!image.is_primary && (
                        <Tooltip title="Сделать основным">
                          <IconButton onClick={() => handleSetPrimary(image.id)}>
                            <StarBorderIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Редактировать">
                        <IconButton onClick={() => handleOpenEditDialog(image)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(image)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}
      
      {/* Диалог добавления изображения */}
      
      {/* Диалог редактирования изображения */}
      <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать изображение</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                required
                fullWidth
                name="image_url"
                label="URL изображения"
                value={formValues.image_url}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="alt_text"
                label="Альтернативный текст"
                value={formValues.alt_text}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="display_order"
                label="Порядок отображения"
                type="number"
                value={formValues.display_order}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.is_primary}
                    onChange={handleFormChange}
                    name="is_primary"
                  />
                }
                label="Основное изображение"
              />
            </Grid>
            {formValues.image_url && (
              <Grid item xs={12}>
                <Box sx={{ mt: 1, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Предварительный просмотр:
                  </Typography>
                  <Box
                    component="img"
                    src={formValues.image_url}
                    alt={formValues.alt_text || 'Предпросмотр'}
                    sx={{
                      display: 'block',
                      maxWidth: '100%',
                      maxHeight: 200,
                      margin: '0 auto',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Ошибка+загрузки';
                    }}
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
            onClick={handleEditImage}
            color="primary"
            variant="contained"
            disabled={loading || !formValues.image_url}
          >
            {loading ? <CircularProgress size={24} /> : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Диалог удаления изображения */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Удалить изображение</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы действительно хотите удалить это изображение? Это действие невозможно отменить.
          </DialogContentText>
          {currentImage && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Box
                component="img"
                src={currentImage.image_url}
                alt={currentImage.alt_text || 'Удаляемое изображение'}
                sx={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: 200,
                  margin: '0 auto',
                  objectFit: 'contain'
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} color="inherit">
            Отмена
          </Button>
          <Button
            onClick={handleDeleteImage}
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

export default ProductImagesPage;