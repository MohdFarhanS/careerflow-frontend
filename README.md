# CareerFlow — Frontend

Aplikasi web untuk melacak progres lamaran kerja. Dibangun dengan React 19, Vite, dan Tailwind CSS v4.

## Tech Stack

| Layer | Library / Tool |
|---|---|
| UI | React 19 |
| Routing | React Router DOM v7 |
| Form | React Hook Form + Zod |
| HTTP | Axios |
| Styling | Tailwind CSS v4 |
| Build | Vite 8 |

## Struktur Project

```
src/
├── api/
│   ├── axios.js          # Axios instance + interceptor 401
│   └── authService.js    # Endpoint auth (login, register, logout, getUser)
├── components/
│   └── ui/
│       ├── Badge.jsx     # Status badge lamaran
│       ├── Button.jsx    # Button multi-variant
│       ├── Card.jsx      # Card container
│       ├── Input.jsx     # Input dengan error handling
│       └── Spinner.jsx   # Loading spinner
├── context/
│   └── AuthContext.jsx   # State auth global (user, login, logout)
├── hooks/
│   └── useAuth.js        # Hook untuk mengakses AuthContext
├── layouts/
│   ├── AuthLayout.jsx    # Layout halaman login/register
│   └── DashboardLayout.jsx # Layout dashboard dengan sidebar
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   └── Dashboard/
│       └── Dashboard.jsx
├── routes/
│   └── AppRoutes.jsx     # Route config + ProtectedRoute + GuestRoute
└── utils/
    └── validation/
        └── authSchema.js # Zod schema untuk login & register
```

## Prasyarat

- Node.js 18+
- Backend Laravel berjalan di `http://localhost:8000`
- Laravel Sanctum dikonfigurasi di backend

## Setup

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Dev server berjalan di `http://localhost:5173`. Proxy `/api` dan `/sanctum` diteruskan ke `http://localhost:8000`.

## Scripts

| Script | Fungsi |
|---|---|
| `npm run dev` | Dev server dengan HMR |
| `npm run build` | Build produksi ke `dist/` |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Jalankan ESLint |

## Autentikasi

Flow autentikasi menggunakan Laravel Sanctum (cookie-based):

1. `GET /sanctum/csrf-cookie` — ambil CSRF token sebelum login/register
2. `POST /api/login` atau `POST /api/register` — autentikasi
3. `GET /api/user` — cek sesi aktif saat app dimuat
4. `POST /api/logout` — hapus sesi

Jika respons `401` diterima saat user sudah login, aplikasi otomatis logout via `CustomEvent('auth:unauthorized')`.

## Routes

| Path | Akses | Halaman |
|---|---|---|
| `/login` | Guest only | Halaman login |
| `/register` | Guest only | Halaman register |
| `/dashboard` | Auth only | Dashboard utama |
| `*` | — | Redirect ke `/dashboard` |

## Komponen UI

### Button

```jsx
<Button variant="primary" isLoading={false}>Label</Button>
```

Variant: `primary` | `secondary` | `outline` | `danger` | `ghost`

### Badge

```jsx
<Badge status="Applied" />
```

Status: `Applied` | `Screening` | `Technical Test` | `Interview` | `Offered` | `Rejected`

### Input

```jsx
<Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
```

### Card

```jsx
<Card className="optional-extra-class">content</Card>
```

## Environment Variables

| Variable | Default | Keterangan |
|---|---|---|
| `VITE_BACKEND_URL` | `http://localhost:8000` | URL backend Laravel |
