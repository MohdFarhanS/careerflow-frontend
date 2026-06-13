import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

let _isAuthenticated = false;
export function setAuthState(authenticated) { _isAuthenticated = authenticated; }

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && _isAuthenticated) {
      _isAuthenticated = false;
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;