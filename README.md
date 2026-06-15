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
| Chart | Recharts v3 (siap pakai) |

## Struktur Project

```
src/
├── api/
│   ├── axios.js               # Axios instance + interceptor 401
│   ├── authService.js         # Endpoint auth (login, register, logout, getUser, forgotPassword, resetPassword)
│   ├── applicationService.js  # Endpoint lamaran (CRUD + schema + updateNotes)
│   ├── dashboardService.js    # Endpoint dashboard (GET /dashboard)
│   ├── documentService.js     # Endpoint dokumen (getAll, upload, delete)
│   └── interviewService.js    # Endpoint interview (CRUD)
├── components/
│   ├── dashboard/
│   │   ├── StatCard.jsx           # Kartu angka ringkasan
│   │   ├── StatsGrid.jsx          # Grid 4 stat card
│   │   ├── ApplicationPieChart.jsx # Pie chart status lamaran (Recharts)
│   │   ├── MonthlyBarChart.jsx    # Bar chart lamaran per bulan (Recharts)
│   │   └── RecentApplications.jsx # Tabel 5 lamaran terbaru
│   ├── forms/
│   │   ├── ApplicationForm.jsx   # Form tambah/edit lamaran
│   │   └── InterviewForm.jsx     # Form tambah/edit interview
│   └── ui/
│       ├── Badge.jsx          # Status badge lamaran
│       ├── Button.jsx         # Button multi-variant (prop: isLoading, disabled)
│       ├── Card.jsx           # Card container
│       ├── EmptyState.jsx     # Empty state (prop: icon, title, description, action)
│       ├── Input.jsx          # Input dengan error handling (forwardRef)
│       ├── Modal.jsx          # Portal modal + Escape key + scroll lock
│       ├── Select.jsx         # Select dengan error handling (forwardRef)
│       ├── SkeletonRow.jsx    # Skeleton loading row (prop: cols)
│       └── Spinner.jsx        # Loading spinner
├── context/
│   └── AuthContext.jsx        # State auth global (user, login, logout)
├── hooks/
│   ├── useAuth.js             # Hook untuk mengakses AuthContext
│   ├── useApplications.js    # Fetch + filter + pagination lamaran
│   ├── useApplicationDetail.js # Fetch detail + save notes satu lamaran
│   ├── useDashboard.js       # Fetch data ringkasan dashboard
│   ├── useDocuments.js       # Fetch + upload + delete dokumen
│   └── useInterviews.js      # Fetch + filter + pagination + CRUD interview
├── layouts/
│   ├── AuthLayout.jsx         # Layout halaman login/register
│   └── DashboardLayout.jsx    # Layout dashboard dengan sidebar
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   ├── Applications/
│   │   ├── ApplicationsPage.jsx
│   │   ├── ApplicationDetailPage.jsx        # Halaman detail satu lamaran
│   │   └── components/
│   │       ├── ApplicationFilters.jsx   # Filter search/status/sort
│   │       ├── ApplicationFormModal.jsx # Modal wrapper untuk ApplicationForm
│   │       ├── ApplicationTable.jsx     # Tabel dengan skeleton + aksi edit/hapus + klik baris ke detail
│   │       ├── ApplicationInfoCard.jsx  # Kartu info utama lamaran (posisi, perusahaan, status, dll.)
│   │       ├── InterviewListCard.jsx    # Daftar interview terkait lamaran
│   │       └── NotesCard.jsx            # Catatan editable dengan optimistic update
│   ├── Dashboard/
│   │   └── Dashboard.jsx
│   ├── Documents/
│   │   ├── DocumentsPage.jsx
│   │   └── components/
│   │       └── UploadCard.jsx           # Kartu upload per tipe dokumen (CV / portfolio)
│   └── Interviews/
│       ├── InterviewsPage.jsx
│       └── components/
│           ├── InterviewCard.jsx        # Kartu satu jadwal interview
│           ├── InterviewDeleteModal.jsx # Konfirmasi hapus interview
│           ├── InterviewFilters.jsx     # Filter tipe/sort/upcoming
│           └── InterviewFormModal.jsx   # Modal wrapper untuk InterviewForm
├── routes/
│   └── AppRoutes.jsx          # Route config + ProtectedRoute + GuestRoute
└── utils/
    ├── cn.js                  # Class name merger
    └── validation/
        ├── authSchema.js         # Zod schema login & register
        ├── applicationSchema.js  # Zod schema lamaran
        ├── documentSchema.js     # Zod schema upload dokumen & portfolio URL
        └── interviewSchema.js    # Zod schema interview
```

## Prasyarat

- Node.js 18+
- Backend Laravel berjalan di `http://localhost:8000`
- Laravel Sanctum dikonfigurasi di backend

## Setup

```bash
npm install
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

## Halaman

| Path | Akses | Status |
|---|---|---|
| `/login` | Guest only | Selesai |
| `/register` | Guest only | Selesai |
| `/forgot-password` | Guest only | Selesai |
| `/reset-password` | Guest only | Selesai |
| `/dashboard` | Auth only | Selesai (stats + chart + recent) |
| `/applications` | Auth only | Selesai |
| `/applications/:id` | Auth only | Selesai (detail + notes + interview) |
| `/interviews` | Auth only | Selesai |
| `/documents` | Auth only | Selesai (upload CV + portfolio) |
| `*` | — | Redirect ke `/dashboard` |

## Autentikasi

Flow autentikasi menggunakan Laravel Sanctum (cookie-based):

1. `GET /sanctum/csrf-cookie` — ambil CSRF token sebelum login/register
2. `POST /api/login` atau `POST /api/register` — autentikasi
3. `GET /api/user` — cek sesi aktif saat app dimuat
4. `POST /api/logout` — hapus sesi
5. `POST /api/forgot-password` — kirim link reset password ke email
6. `POST /api/reset-password` — konfirmasi reset password dengan token

Jika respons `401` diterima saat user sudah login, aplikasi otomatis logout via `CustomEvent('auth:unauthorized')`.

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

### Input & Select

```jsx
<Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
<Select label="Status" required error={errors.status?.message} {...register('status')}>
  <option value="">Pilih status</option>
</Select>
```

Keduanya menggunakan `forwardRef` — kompatibel langsung dengan React Hook Form.

### Modal

```jsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Judul" size="md">
  {/* content */}
</Modal>
```

Size: `sm` | `md` | `lg` | `xl`. Tutup dengan klik backdrop atau tekan Escape.

### EmptyState

```jsx
<EmptyState
  icon={Briefcase}
  title="Belum ada data"
  description="Deskripsi opsional"
  action={<Button>Tambah</Button>}
/>
```

### SkeletonRow

```jsx
<SkeletonRow cols={5} />
```

### Card

```jsx
<Card className="optional-extra-class">content</Card>
```

## Environment Variables

| Variable | Default | Keterangan |
|---|---|---|
| `VITE_BACKEND_URL` | `http://localhost:8000` | URL backend Laravel |
