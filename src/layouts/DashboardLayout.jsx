import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Applications', path: '/applications' },
  { label: 'Interviews', path: '/interviews' },
  { label: 'Documents', path: '/documents' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-ink-50">
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-ink-100 p-5 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">A</div>
          <span className="font-bold text-lg text-ink-900">CareerFlow</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-ink-600 hover:bg-ink-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-ink-100 pt-4">
          <p className="text-sm font-medium text-ink-800 truncate">{user?.name}</p>
          <p className="text-xs text-ink-400 truncate mb-3">{user?.email}</p>
          <Button variant="outline" className="w-full" onClick={logout}>
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}