# CLAUDE.md — CareerFlow Frontend

Panduan ini wajib dibaca sebelum mengerjakan tugas apapun di repository ini.

## Overview

CareerFlow adalah aplikasi pelacak lamaran kerja. Frontend ini adalah SPA React yang berkomunikasi dengan backend Laravel via REST API.

**Backend**: Laravel 11 + Sanctum, berjalan di `http://localhost:8000`
**Frontend**: React 19 + Vite, berjalan di `http://localhost:5173`

---

## Commands

```bash
npm run dev       # Start dev server (port 5173)
npm run build     # Production build ke dist/
npm run lint      # Jalankan ESLint
npm run preview   # Preview hasil build
```

---

## Arsitektur

### Autentikasi
- Menggunakan Laravel Sanctum (stateful, cookie-based)
- `AuthContext` menyimpan state `user`, `loading`, dan method `login`, `register`, `logout`
- `setAuthState()` di `api/axios.js` dipakai interceptor untuk deteksi session expire
- Jika 401 diterima saat sudah login → dispatch `CustomEvent('auth:unauthorized')` → AuthContext reset user ke null

### Routing
- `ProtectedRoute` → redirect ke `/login` jika tidak auth
- `GuestRoute` → redirect ke `/dashboard` jika sudah auth
- Semua route unknown → redirect ke `/dashboard`

### API Layer
- `src/api/axios.js` — Axios instance dengan `baseURL: '/api'`, `withCredentials: true`
- `src/api/authService.js` — fungsi-fungsi endpoint auth
- Proxy Vite meneruskan `/api/*` dan `/sanctum/*` ke `http://localhost:8000`

### Form Handling
- Semua form menggunakan **React Hook Form** + **Zod resolver**
- Schema validasi ada di `src/utils/validation/authSchema.js`
- Pesan error ditulis dalam **Bahasa Indonesia**

---

## Konvensi Kode

### File & Folder
- Komponen React → PascalCase (`Button.jsx`, `AuthLayout.jsx`)
- Hook → camelCase dengan prefix `use` (`useAuth.js`)
- Util/service → camelCase (`authService.js`, `authSchema.js`)
- Semua komponen page ada di `src/pages/<FeatureName>/`

### Komponen
- Gunakan komponen UI yang sudah ada di `src/components/ui/` sebelum membuat baru
- `Input.jsx` menggunakan `forwardRef` — wajib jika dipakai dengan React Hook Form
- `Button.jsx` menerima prop `isLoading` untuk state submit
- Jangan buat komponen baru untuk one-off use case; tulis inline dulu

### Styling
- **Tailwind CSS v4** — semua class utility
- Custom color tokens: `primary-*` (ungu) dan `ink-*` (slate abu-abu)
- Custom font: `Plus Jakarta Sans` (diload dari Google Fonts di `index.css`)
- Custom shadow: `shadow-soft`, `shadow-card`
- Tidak ada CSS module atau styled-components — semua Tailwind

### State
- Hanya gunakan React Context untuk state global (auth)
- State lokal pakai `useState`
- Tidak ada Redux atau Zustand

---

## Status Halaman

| Halaman | Path | Status |
|---|---|---|
| Login | `/login` | Selesai |
| Register | `/register` | Selesai |
| Dashboard | `/dashboard` | Placeholder |
| Applications | `/applications` | Belum ada |
| Interviews | `/interviews` | Belum ada |
| Documents | `/documents` | Belum ada |

Sidebar di `DashboardLayout` sudah menampilkan nav ke halaman-halaman di atas, tapi halaman-nya belum dibuat.

---

## Dependency Penting

| Package | Versi | Catatan |
|---|---|---|
| react | ^19 | Stable, gunakan hooks |
| react-router-dom | ^7 | Flat route config |
| react-hook-form | ^7 | Selalu pakai zodResolver |
| zod | ^4 | Schema validasi |
| axios | ^1 | HTTP client |
| recharts | ^3 | Belum dipakai, siap untuk fitur chart dashboard |
| tailwindcss | ^4 | CSS via PostCSS |

---

## Hal yang Perlu Diperhatikan

1. **Jangan import langsung dari axios** — selalu gunakan instance dari `src/api/axios.js` untuk request ke API internal. Import `axios` langsung hanya boleh untuk CSRF cookie di `authService.js`.

2. **CSRF sebelum mutation** — panggil `authService.getCsrfCookie()` sebelum `login()` atau `register()`. Sudah dihandle di `AuthContext`.

3. **Tailwind v4** — konfigurasi tema ada di `src/index.css` dalam blok `@theme {}`, bukan di `tailwind.config.js`. Jika perlu tambah token baru, tambahkan di sana.

4. **`hero.png`** di `src/assets/` belum digunakan — siap untuk landing page atau ilustrasi onboarding.

5. **recharts** sudah ter-install — gunakan untuk fitur grafik di dashboard nantinya, tidak perlu install ulang.
