import {
    PieChart, Pie, Cell, Tooltip,
    Legend, ResponsiveContainer,
  } from 'recharts';
  
  const STATUS_COLORS = {
    Applied: '#6366f1',       // indigo
    Screening: '#f59e0b',     // amber
    'Technical Test': '#8b5cf6', // violet
    Interview: '#06b6d4',     // cyan
    Offered: '#22c55e',       // green
    Rejected: '#ef4444',      // red
  };
  
  export function ApplicationPieChart({ stats, loading }) {
    if (loading) {
      return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 animate-pulse">
          <div className="h-4 w-32 bg-slate-200 rounded mb-6" />
          <div className="h-52 bg-slate-100 rounded-lg" />
        </div>
      );
    }
  
    const chartData = Object.entries(stats ?? {})
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  
    if (chartData.length === 0) {
      return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Status Lamaran</h3>
          <div className="h-52 flex items-center justify-center text-slate-400 text-sm">
            Belum ada data lamaran.
          </div>
        </div>
      );
    }
  
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Status Lamaran</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STATUS_COLORS[entry.name] ?? '#94a3b8'}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }