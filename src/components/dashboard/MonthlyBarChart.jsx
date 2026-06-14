import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
  } from 'recharts';
  
  export function MonthlyBarChart({ monthlyChart, loading }) {
    if (loading) {
      return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 animate-pulse">
          <div className="h-4 w-40 bg-slate-200 rounded mb-6" />
          <div className="h-52 bg-slate-100 rounded-lg" />
        </div>
      );
    }
  
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Lamaran per Bulan (12 Bulan Terakhir)
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              // Hanya tampilkan label setiap 3 bulan agar tidak crowded
              interval={2}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
              }}
              formatter={(value) => [value, 'Lamaran']}
            />
            <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }