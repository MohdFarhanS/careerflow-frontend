import { useCallback, useEffect, useState } from 'react';
import { applicationService } from '../api/applicationService';

const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  location: '',
  sort: 'newest',
};

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [meta, setMeta]                 = useState(null); // pagination meta
  const [filters, setFilters]           = useState(DEFAULT_FILTERS);
  const [page, setPage]                 = useState(1);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        page,
        // Jangan kirim 'all' ke backend — backend tidak kenal value ini
        status: filters.status === 'all' ? undefined : filters.status,
      };
      const data = await applicationService.getAll(params);
      setApplications(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError('Gagal memuat data lamaran. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // reset ke page 1 setiap filter berubah
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return {
    applications,
    meta,
    filters,
    page,
    isLoading,
    error,
    setPage,
    updateFilter,
    resetFilters,
    refetch: fetchApplications,
  };
}