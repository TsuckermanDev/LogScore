import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://45.93.200.224:3000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (login, password) =>
        api.post('/auth/login', { login, password }),
    verify: () =>
        api.get('/auth/verify'),
    logout: () =>
        api.post('/auth/logout')
};

// Servers API
export const serversAPI = {
    getAll: () =>
        api.get('/servers'),
    register: (serverId, serverName) =>
        api.post('/servers/register', { server_id: serverId, server_name: serverName }),
    delete: (serverId) =>
        api.delete(`/servers/${serverId}`)
};

// Types API
export const typesAPI = {
    getAll: () =>
        api.get('/types'),
    getTypeData: (serverId, logType) => api.get(`/types/${serverId}/${logType}/data`),
    getByServer: (serverId) =>
        api.get(`/types/${serverId}`),
    register: (logType, serverId) =>
        api.post('/types/register', { log_type: logType, server_id: serverId }),
    delete: (id) =>
        api.delete(`/types/${id}`)
};

// Stats API
export const statsAPI = {
    getOverview: () =>
        api.get('/stats/overview'),
    getServerStats: (serverId) =>
        api.get(`/stats/servers/${serverId}`),
    getTypeStats: (serverId, logType) =>
        api.get(`/stats/servers/${serverId}/types/${logType}`),
    get: (serverIds, dateFrom, dateTo) => {
        const params = {
            serverIds: serverIds?.join(',') || '',
            dateFrom: dateFrom || '',
            dateTo: dateTo || ''
        };
        return api.get('/stats', { params });
    }
};

// Logs API
export const logsAPI = {
    search: (filters) => {
        const offset = ((filters.page || 1) - 1) * (filters.limit || 50);
        
        const params = {
            serverIds: filters.serverIds?.join(',') || '',
            logTypes: filters.logTypes?.join(',') || '',
            dateFrom: filters.dateFrom || '',
            dateTo: filters.dateTo || '',
            filters: filters.dataFilters ? JSON.stringify(filters.dataFilters) : '',
            limit: filters.limit || 50,
            offset: offset,
            orderBy: filters.orderBy || 'datetime',
            orderDir: filters.orderDir || 'DESC',
            format: filters.format || 'raw'
        };
        
        return api.get('/logs', { params });
    },
    
    export: (filters) => {
        const params = {
            serverIds: filters.serverIds?.join(',') || '',
            logTypes: filters.logTypes?.join(',') || '',
            dateFrom: filters.dateFrom || '',
            dateTo: filters.dateTo || '',
            filters: filters.dataFilters ? JSON.stringify(filters.dataFilters) : '',
            format: filters.exportFormat || 'json'
        };
        
        return api.get('/logs/export', { 
            params,
            responseType: filters.exportFormat === 'csv' ? 'text' : 'json'
        });
    }
};

// API Keys API
export const apiKeysAPI = {
    getAll: () =>
        api.get('/api-keys'),
    create: (name, expiresAt) =>
        api.post('/api-keys', { name, expires_at: expiresAt }),
    delete: (id) =>
        api.delete(`/api-keys/${id}`)
};

// Settings API
export const settingsAPI = {
    getSettings: () =>
        api.get('/settings'),
    updateSettings: (settings) =>
        api.put('/settings', settings),
    getExpireDays: () =>
        api.get('/settings/expire-days'),
    setExpireDays: (days) =>
        api.put('/settings/expire-days', { days })
};

// Architecture API
export const architectureAPI = {
    getAll: () =>
        api.get('/architecture')
};

export default api;