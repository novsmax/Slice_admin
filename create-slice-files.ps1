# Скрипт для создания файловой структуры админ-панели Slice

# Создание директорий
$directories = @(
    "src\api",
    "src\components",
    "src\components\layout",
    "src\contexts",
    "src\pages"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir
        Write-Host "Создана директория: $dir" -ForegroundColor Green
    } else {
        Write-Host "Директория $dir уже существует" -ForegroundColor Yellow
    }
}

# Список файлов для создания
$files = @(
    # Корневые файлы
    "src\theme.js",
    "src\App.js",
    ".env",

    # API сервисы
    "src\api\authService.js",
    "src\api\productService.js",
    "src\api\categoryService.js",
    "src\api\brandService.js",
    "src\api\productImageService.js",

    # Контексты
    "src\contexts\AuthContext.js",

    # Компоненты
    "src\components\layout\DashboardLayout.js",
    "src\components\ProtectedRoute.js",

    # Страницы
    "src\pages\Login.js",
    "src\pages\Dashboard.js",
    "src\pages\Products.js",
    "src\pages\Categories.js",
    "src\pages\Brands.js",
    "src\pages\ProductImages.js"

)

# Создание файлов
foreach ($file in $files) {
    if (!(Test-Path $file)) {
        New-Item -ItemType File -Force -Path $file
        Write-Host "Создан файл: $file" -ForegroundColor Green
    } else {
        Write-Host "Файл $file уже существует" -ForegroundColor Yellow
    }
}

# Запись в .env
$envContent = "REACT_APP_API_URL=http://localhost:8000/api/v1"
Set-Content -Path ".env" -Value $envContent
Write-Host "Добавлена конфигурация в .env" -ForegroundColor Green

# Обновление index.js
$indexJsContent = @"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"@

Set-Content -Path "src\index.js" -Value $indexJsContent
Write-Host "Обновлен файл src\index.js" -ForegroundColor Green

Write-Host "`nСтруктура файлов для админ-панели Slice успешно создана!" -ForegroundColor Cyan
Write-Host "Теперь вы можете заполнить файлы соответствующим кодом из артефактов." -ForegroundColor Cyan