import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Badge from '../ui/Badge';

export function RecentApplications({ applications, loading }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Lamaran Terbaru</h3>
        <Link
          to="/applications"
          className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium"
        >
          Lihat semua <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-3 flex items-center justify-between gap-4 animate-pulse">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 bg-ink-100 rounded w-2/3" />
                <div className="h-3 bg-ink-100 rounded w-1/2" />
              </div>
              <div className="h-6 bg-ink-100 rounded-full w-20 shrink-0" />
            </div>
          ))}
        </div>
      ) : applications?.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">
          Belum ada lamaran. <Link to="/applications" className="text-indigo-600 hover:underline">Tambah sekarang</Link>
        </p>
      ) : (
        <div className="divide-y divide-slate-50">
          {applications.map((app) => (
            <div key={app.id} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {app.company_name}
                </p>
                <p className="text-xs text-slate-500 truncate">{app.position}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-400 hidden sm:block">
                  {new Date(app.applied_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <Badge status={app.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
