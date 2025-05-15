// src/components/FileUpload.js
import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const UploadBox = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'isDragging'
  })(({ theme, isDragging }) => ({
    border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    textAlign: 'center',
    cursor: 'pointer',
    background: isDragging ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
    transition: 'border-color 0.2s, background 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center'
  }));
  
  const Input = styled('input')({
    display: 'none'
  });

const FileUpload = ({ onFileUpload, accept = "image/*", maxSize = 5242880 }) => {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    setError(null);
    const file = files[0];
    
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, загрузите только изображения');
      return;
    }
    
    // Проверка размера файла
    if (file.size > maxSize) {
      setError(`Размер файла не должен превышать ${maxSize / 1024 / 1024}MB`);
      return;
    }
    
    // Показываем предварительный просмотр
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // Запускаем загрузку файла
    setLoading(true);
    
    // Передаем файл родительскому компоненту
    onFileUpload(file)
      .then(() => {
        setLoading(false);
        setPreview(null); // Очищаем предпросмотр после успешной загрузки
      })
      .catch(err => {
        setLoading(false);
        setError(err.message || 'Ошибка при загрузке файла');
      });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      <UploadBox
        isDragging={dragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <Input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={accept}
        />
        
        {loading ? (
          <CircularProgress />
        ) : preview ? (
          <Box sx={{ mb: 2 }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: 200 }} 
            />
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Загрузка...
            </Typography>
          </Box>
        ) : (
          <>
            <CloudUploadIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Перетащите файл сюда
            </Typography>
            <Typography variant="body2" color="textSecondary">
              или
            </Typography>
            <Button
              variant="outlined"
              component="span"
              sx={{ mt: 2 }}
            >
              Выберите файл
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Только изображения, макс {maxSize / 1024 / 1024}MB
            </Typography>
          </>
        )}
      </UploadBox>
    </Box>
  );
};

export default FileUpload;