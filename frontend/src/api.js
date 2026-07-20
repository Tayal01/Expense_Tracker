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
  // "Remember me" decides which storage holds the session (see AuthContext).
  const token =
    localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is expired/invalid the backend answers 401. Clear the stale
// session and send the user back to the login page instead of leaving them
// on a dashboard where every request silently fails. Auth endpoints are
// excluded so a wrong password still shows its error inline.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthCall = error.config?.url?.includes('/auth/');
    if (status === 401 && !isAuthCall) {
      for (const storage of [localStorage, sessionStorage]) {
        storage.removeItem('token');
        storage.removeItem('user');
      }
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
