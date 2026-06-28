import axios from 'axios'

const api = axios.create({
    baseURL: 'http://192.168.0.100:8000'
})

export const getProducts = () => api.get('/products/')
export const getProductByBarcode = (barcode) => api.get(`/products/${barcode}`)
export const createProduct = (data) => api.post('/products/', data)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)

export const addToInventory = (data) => api.post('/inventory/add', data)
export const removeFromInventory = (data) => api.post('/inventory/remove', data)

export const registerSale = (data) => api.post('/sales/', data)

export const getSummary = () => api.get('/reports/summary')
export const getLogs = () => api.get('/reports/logs')
