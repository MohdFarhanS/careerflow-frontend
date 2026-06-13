import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-ink-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-11 w-11 rounded-2xl bg-primary-600 text-white font-bold text-lg mb-3">
            A
          </div>
          <h1 className="text-2xl font-bold text-ink-900">CareerFlow</h1>
          <p className="text-sm text-ink-500 mt-1">Lacak progres lamaran kerjamu dengan mudah</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}