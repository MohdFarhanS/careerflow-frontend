import axios from 'axios';

// Origin backend (Railway) untuk production, mis. "https://careerflow-api.up.railway.app".
// Dev: kosong → '' → pakai path relatif yang diteruskan Vite proxy ke localhost:8000.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? '';

// C9 / D-05: gagal cepat & jelas bila build production lupa set VITE_BACKEND_URL,
// alih-alih diam-diam mengirim request ke origin Vercel (yang tidak punya backend).
if (import.meta.env.PROD && !BACKEND_URL) {
  throw new Error(
    'VITE_BACKEND_URL belum diset. Set environment variable ini di Vercel sebelum build production.'
  );
}

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Auth via Bearer token (Sanctum API token). Lintas-domain Vercel↔Railway tidak bisa
// memakai cookie/CSRF, jadi token dikirim eksplisit di header Authorization.
// Disimpan di localStorage agar sesi bertahan setelah refresh.
const TOKEN_KEY = 'careerflow_token';
let _token = localStorage.getItem(TOKEN_KEY);

export function setAuthToken(token) {
  _token = token;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getAuthToken() { return _token; }

api.interceptors.request.use((config) => {
  if (_token) config.headers.Authorization = `Bearer ${_token}`;
  return config;
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
      setAuthToken(null); // token basi/expired → bersihkan dari localStorage
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      error.userMessage = ERROR_MESSAGES[401];
    } else if (status !== 401) {
      error.userMessage = ERROR_MESSAGES[status] ?? 'Terjadi kesalahan. Silakan coba lagi.';
    }
    return Promise.reject(error);
  }
);

export default api;
