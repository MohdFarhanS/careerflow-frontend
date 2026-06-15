import { useState, useEffect, useCallback } from 'react';
import applicationService from '../api/applicationService';

export function useApplicationDetail(id) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchDetail = useCallback(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    applicationService
      .getById(id)
      .then((data) => {
        if (!cancelled) setApplication(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || 'Gagal memuat data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    return fetchDetail();
  }, [fetchDetail]);

  const saveNotes = useCallback(
    async (notes) => {
      setSavingNotes(true);
      try {
        const updated = await applicationService.updateNotes(id, notes);
        setApplication((prev) => ({ ...prev, notes: updated.notes }));
      } finally {
        setSavingNotes(false);
      }
    },
    [id]
  );

  return { application, loading, error, savingNotes, saveNotes, refetch: fetchDetail };
}