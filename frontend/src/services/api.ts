import axios from 'axios';
import { ApiResponse, LoginRequest, LoginResponse } from '../types';

const API_BASE_URL = 'https://invoice-server-3ypc.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: LoginRequest) => 
    api.post<ApiResponse<LoginResponse>>('/auth/login', data),
  
  createAuth: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ email: string }>>('/auth/create', data),
};

export const customersAPI = {
  getAll: () => api.get('/customers'),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.patch(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

export const inventoryAPI = {
  getAll: () => api.get('/inventory-item'),
  getById: (id: string) => api.get(`/inventory-item/${id}`),
  create: (data: any) => api.post('/inventory-item', data),
  update: (id: string, data: any) => api.patch(`/inventory-item/${id}`, data),
  delete: (id: string) => api.delete(`/inventory-item/${id}`),
  search: (query: string) => api.get(`/inventory-item/search?q=${query}`),
};

export const salesOrderAPI = {
  getAll: () => api.get('/sales-order'),
  getById: (id: string) => api.get(`/sales-order/${id}`),
  create: (data: any) => api.post('/sales-order', data),
  update: (id: string, data: any) => api.patch(`/sales-order/${id}`, data),
  updateStatus: (id: string, status: 'accept' | 'reject') => 
    api.patch(`/sales-order/${id}/status/${status}`),
  sendEmail: (id: string) => api.post(`/sales-order/${id}/mail`),
};

export const invoiceAPI = {
  getAll: () => api.get('/invoice'),
  getById: (id: string) => api.get(`/invoice/${id}`),
  create: (data: any) => api.post('/invoice', data),
  update: (id: string, data: any) => api.patch(`/invoice/${id}`, data),
  updateStatus: (id: string, status: 'paid' | 'overdue' | 'cancelled') => 
    api.patch(`/invoice/${id}/status/${status}`),
};

export default api;