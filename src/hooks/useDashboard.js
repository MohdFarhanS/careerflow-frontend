import { useState, useEffect } from 'react';
import { dashboardService } from '../api/dashboardService';

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await dashboardService.getSummary();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Gagal memuat data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDashboard();

    // Cleanup: cegah state update jika komponen unmount sebelum fetch selesai
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}