import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`
});

export const restaurantesAPI = {
  getAll: () => api.get('/restaurantes'),
  getMenu: (id) => api.get(`/restaurantes/${id}/menu`),
  create: (data) => api.post('/restaurantes', data),
  update: (id, data) => api.put(`/restaurantes/${id}`, data),
  delete: (id) => api.delete(`/restaurantes/${id}`),
  createMenuItem: (data) => api.post('/menu-items', data),
  updateMenuItem: (id, data) => api.put(`/menu-items/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/menu-items/${id}`)
};

export const usuariosAPI = {
  getAll: () => api.get('/usuarios'),
  create: (data) => api.post('/usuarios', data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`)
};

export const pedidosAPI = {
  getAll: () => api.get('/pedidos'),
  getById: (id) => api.get(`/pedidos/${id}`),
  create: (pedidoData) => api.post('/pedidos', pedidoData)
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
};