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
  withCredentials: true,
  // C3 / D-04: lampirkan header X-XSRF-TOKEN HANYA ke origin backend. Pada request
  // cross-origin axios tidak menambahkannya otomatis. Bentuk fungsi cek-origin dipakai
  // (bukan `true` polos) agar token CSRF tidak ikut terkirim ke origin pihak ketiga.
  withXSRFToken: (config) => {
    if (!BACKEND_URL) return true; // dev same-origin via proxy → default axios aman
    try {
      return new URL(config.url, config.baseURL).origin === new URL(BACKEND_URL).origin;
    } catch {
      return false;
    }
  },
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
