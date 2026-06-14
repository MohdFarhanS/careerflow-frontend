import { cn } from '../../utils/cn';

export function StatCard({ label, value, icon: Icon, colorClass, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-7 w-12 bg-slate-200 rounded" />
          </div>
          <div className="h-10 w-10 bg-slate-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}