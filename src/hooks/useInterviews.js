// src/hooks/useInterviews.js
import { useState, useEffect, useCallback } from 'react';
import { interviewService } from '../api/interviewService';

/**
 * Hook ini mengelola:
 * - Fetch list interview + re-fetch saat filter berubah
 * - State filter (interview_type, sort, upcoming)
 * - Pagination
 * - Loading & error state
 * - CRUD actions (create, update, delete) dengan optimistic-ish update
 *   (refetch setelah mutasi untuk menjaga konsistensi dengan backend)
 *
 * Pattern cancelled flag dipakai (sama dengan useDashboard.js)
 * untuk mencegah state update setelah komponen unmount.
 */
export function useInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        upcoming: '',       // '' | 'true'
        interview_type: '', // '' | 'Online' | 'Offline'
        sort: 'soonest',    // 'soonest' | 'latest'
        page: 1,
    });

    // fetchInterviews sengaja tidak pakai async/await agar cleanup function bisa
    // dikembalikan secara sinkron ke useEffect. Jika async, return value-nya adalah
    // Promise â€” useEffect tidak bisa return Promise sebagai cleanup.
    const fetchInterviews = useCallback((currentFilters) => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        // Bersihkan params kosong sebelum kirim ke API
        const params = Object.fromEntries(
            Object.entries(currentFilters).filter(([, v]) => v !== '' && v !== undefined)
        );

        interviewService.getAll(params)
            .then((result) => {
                if (!cancelled) {
                    setInterviews(result.data);
                    setMeta(result.meta);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError('Gagal memuat data interview.');
                    if (import.meta.env.DEV) console.error(err);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        const cleanup = fetchInterviews(filters);
        return cleanup;
    }, [filters, fetchInterviews]);

    const refetch = useCallback(() => {
        fetchInterviews(filters);
    }, [filters, fetchInterviews]);

    const updateFilter = useCallback((key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            // Reset ke page 1 setiap kali filter non-page berubah
            page: key === 'page' ? value : 1,
        }));
    }, []);

    // --- Aksi CRUD ---

    const createInterview = useCallback(async (payload) => {
        const result = await interviewService.create(payload);
        refetch();
        return result;
    }, [refetch]);

    const updateInterview = useCallback(async (id, payload) => {
        const result = await interviewService.update(id, payload);
        refetch();
        return result;
    }, [refetch]);

    const deleteInterview = useCallback(async (id) => {
        await interviewService.delete(id);
        // Kalau hapus item terakhir di page > 1, kembali ke page sebelumnya
        const isLastOnPage = interviews.length === 1 && filters.page > 1;
        if (isLastOnPage) {
            updateFilter('page', filters.page - 1);
        } else {
            refetch();
        }
    }, [interviews.length, filters.page, refetch, updateFilter]);

    return {
        interviews,
        meta,
        loading,
        error,
        filters,
        updateFilter,
        createInterview,
        updateInterview,
        deleteInterview,
        refetch,
    };
}