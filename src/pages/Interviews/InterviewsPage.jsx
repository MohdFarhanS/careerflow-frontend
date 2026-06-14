// src/pages/Interviews/InterviewsPage.jsx
import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useInterviews } from '../../hooks/useInterviews';
import InterviewFilters from './components/InterviewFilters';
import InterviewCard from './components/InterviewCard';
import InterviewFormModal from './components/InterviewFormModal';
import InterviewDeleteModal from './components/InterviewDeleteModal';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Card from '../../components/ui/Card';

/**
 * Halaman /interviews
 * Struktur:
 * - Header (judul + tombol Tambah)
 * - Filter bar
 * - Grid kartu interview (atau empty state)
 * - Pagination
 * - Modal create/edit
 * - Modal konfirmasi delete
 */
export default function InterviewsPage() {
    const {
        interviews,
        meta,
        loading,
        error,
        filters,
        updateFilter,
        createInterview,
        updateInterview,
        deleteInterview,
    } = useInterviews();

    // Modal state: null = tutup, {} = create, { ...interview } = edit
    const [formModal, setFormModal] = useState(null);
    // Delete confirm: null = tutup, { ...interview } = konfirmasi hapus
    const [deleteModal, setDeleteModal] = useState(null);

    const openCreate = () => setFormModal({});
    const openEdit = (interview) => setFormModal(interview);
    const closeForm = () => setFormModal(null);

    const isEditMode = formModal && Object.keys(formModal).length > 0;

    // Skeleton loading — tampilkan 6 placeholder card
    if (loading && interviews.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-7 w-40 bg-ink-100 rounded animate-pulse mb-1" />
                        <div className="h-4 w-56 bg-ink-100 rounded animate-pulse" />
                    </div>
                    <div className="h-9 w-36 bg-ink-100 rounded-lg animate-pulse" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border shadow-soft p-5 space-y-3">
                            <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-lg bg-ink-100 animate-pulse flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-ink-100 rounded animate-pulse" />
                                    <div className="h-3 w-3/4 bg-ink-100 rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="h-3 bg-ink-100 rounded animate-pulse" />
                            <div className="h-3 w-2/3 bg-ink-100 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-ink-900">Jadwal Interview</h1>
                        <p className="text-sm text-ink-500 mt-0.5">
                            {meta ? `${meta.total} jadwal interview` : 'Kelola jadwal interview kamu'}
                        </p>
                    </div>
                    <Button variant="primary" onClick={openCreate}>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Tambah Interview
                    </Button>
                </div>

                {/* Filter bar */}
                <InterviewFilters filters={filters} onFilterChange={updateFilter} />

                {/* Error state */}
                {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && interviews.length === 0 && (
                    <EmptyState
                        icon={Calendar}
                        title="Belum ada jadwal interview"
                        description={
                            filters.upcoming === 'true'
                                ? 'Tidak ada interview yang akan datang.'
                                : 'Tambahkan jadwal interview pertamamu.'
                        }
                        action={
                            <Button variant="primary" onClick={openCreate}>
                                <Plus className="w-4 h-4 mr-1.5" />
                                Tambah Interview
                            </Button>
                        }
                    />
                )}

                {/* Grid kartu */}
                {interviews.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {interviews.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                interview={interview}
                                onEdit={openEdit}
                                onDelete={(iv) => setDeleteModal(iv)}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-sm text-ink-500">
                            Menampilkan {meta.from}–{meta.to} dari {meta.total} interview
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                disabled={filters.page <= 1}
                                onClick={() => updateFilter('page', filters.page - 1)}
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                disabled={filters.page >= meta.last_page}
                                onClick={() => updateFilter('page', filters.page + 1)}
                            >
                                Berikutnya
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            <InterviewFormModal
                isOpen={!!formModal}
                onClose={closeForm}
                interview={isEditMode ? formModal : null}
                onSave={isEditMode ? updateInterview : createInterview}
            />

            {/* Modal Konfirmasi Delete */}
            <InterviewDeleteModal
                interview={deleteModal}
                onClose={() => setDeleteModal(null)}
                onConfirm={deleteInterview}
            />
        </>
    );
}