import axios from 'axios';

// Central place all API calls go through. This means we only configure
// the base URL and auth header logic ONCE, instead of repeating it in
// every component that needs to talk to the backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8001/api' : 'https://expense-tracker-mr5k.onrender.com/api'),
});

// Axios "interceptor": runs before every single request. If we have a
// JWT saved from login, attach it as a Bearer token automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
