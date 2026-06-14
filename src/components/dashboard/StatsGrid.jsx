import {
    Briefcase, Clock, FlaskConical,
    Users, CheckCircle, XCircle, LayoutGrid,
  } from 'lucide-react';
  import { StatCard } from './StatCard';
  
  const STAT_CONFIG = [
    {
      key: 'total',
      label: 'Total Lamaran',
      icon: LayoutGrid,
      colorClass: 'bg-indigo-50 text-indigo-600',
    },
    {
      key: 'Applied',
      label: 'Applied',
      icon: Briefcase,
      colorClass: 'bg-blue-50 text-blue-600',
    },
    {
      key: 'Screening',
      label: 'Screening',
      icon: Clock,
      colorClass: 'bg-yellow-50 text-yellow-600',
    },
    {
      key: 'Technical Test',
      label: 'Technical Test',
      icon: FlaskConical,
      colorClass: 'bg-purple-50 text-purple-600',
    },
    {
      key: 'Interview',
      label: 'Interview',
      icon: Users,
      colorClass: 'bg-cyan-50 text-cyan-600',
    },
    {
      key: 'Offered',
      label: 'Offered',
      icon: CheckCircle,
      colorClass: 'bg-green-50 text-green-600',
    },
    {
      key: 'Rejected',
      label: 'Rejected',
      icon: XCircle,
      colorClass: 'bg-red-50 text-red-600',
    },
  ];
  
  export function StatsGrid({ data, loading }) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {STAT_CONFIG.map((config) => {
          const value =
            config.key === 'total'
              ? data?.total ?? 0
              : data?.stats?.[config.key] ?? 0;
  
          return (
            <StatCard
              key={config.key}
              label={config.label}
              value={value}
              icon={config.icon}
              colorClass={config.colorClass}
              loading={loading}
            />
          );
        })}
      </div>
    );
  }