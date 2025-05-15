import { api } from './authService';

const getProducts = async (page = 1, perPage = 10, search = '', categoryId = null, brandId = null, includeInactive = true) => {
    try {
        let url = `/products?page=${page}&per_page=${perPage}`;

        if (search) url += `&query=${encodeURIComponent(search)}`;
        if (categoryId) url += `&category_id=${categoryId}`;
        if (brandId) url += `&brand_id=${brandId}`;
        
        // Добавляем фильтрацию по активности только если необходимо
        // Для админ-панели мы передаём includeInactive = true
        if (!includeInactive) {
            url += `&is_active=true`;
        }

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getProduct = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createProduct = async (productData) => {
    try {
        const response = await api.post('/products', productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateProduct = async (id, productData) => {
    try {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const productService = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};

export default productService;