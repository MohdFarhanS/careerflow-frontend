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

const ERROR_MESSAGES = {
  401: 'Sesi Anda telah berakhir. Silakan login kembali.',
  403: 'Anda tidak memiliki akses ke halaman ini.',
  404: 'Data tidak ditemukan.',
  429: 'Terlalu banyak percobaan. Coba lagi beberapa menit.',
  500: 'Terjadi kesalahan pada server. Silakan coba lagi.',
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 422: pass through; components handle backend validation messages.
    if (status === 422) {
      return Promise.reject(error);
    }

    if (status === 401 && _isAuthenticated) {
      _isAuthenticated = false;
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      error.userMessage = ERROR_MESSAGES[401];
    } else if (status !== 401) {
      error.userMessage = ERROR_MESSAGES[status] ?? 'Terjadi kesalahan. Silakan coba lagi.';
    }
    return Promise.reject(error);
  }
);

export default api;
