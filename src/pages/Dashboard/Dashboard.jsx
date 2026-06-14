import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { StatsGrid } from '../../components/dashboard/StatsGrid';
import { ApplicationPieChart } from '../../components/dashboard/ApplicationPieChart';
import { MonthlyBarChart } from '../../components/dashboard/MonthlyBarChart';
import { RecentApplications } from '../../components/dashboard/RecentApplications';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useDashboard();

  const firstName = user?.name?.split(' ')[0] ?? 'Kamu';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Halo, {firstName} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Berikut ringkasan progres lamaran kerja kamu.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <StatsGrid data={data} loading={loading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ApplicationPieChart stats={data?.stats} loading={loading} />
        <MonthlyBarChart monthlyChart={data?.monthly_chart} loading={loading} />
      </div>

      {/* Recent Applications */}
      <RecentApplications
        applications={data?.recent_applications}
        loading={loading}
      />
    </div>
  );
}