import { Briefcase, Plus } from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { useApplications } from '../../hooks/useApplications';
import ApplicationFilters from './components/ApplicationFilters';
import ApplicationFormModal from './components/ApplicationFormModal';
import ApplicationTable from './components/ApplicationTable';

function Pagination({ meta, page, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-ink-100 pt-4">
      <p className="text-sm text-ink-500">
        Menampilkan {meta.from}–{meta.to} dari {meta.total} lamaran
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="text-xs"
        >
          ← Sebelumnya
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= meta.last_page}
          className="text-xs"
        >
          Berikutnya →
        </Button>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const {
    applications,
    meta,
    filters,
    page,
    isLoading,
    error,
    setPage,
    updateFilter,
    resetFilters,
    refetch,
  } = useApplications();

  // Modal state
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState(null);  // null = create, obj = edit

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting]     = useState(false);

  const openCreateModal = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEditModal = (application) => {
    setEditTarget(application);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const { applicationService } = await import('../../api/applicationService');
      await applicationService.delete(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch {
      // tambahkan toast error jika sudah ada notif system
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Lamaran Kerja</h1>
          <p className="mt-0.5 text-sm text-ink-500">
            Pantau semua proses lamaranmu dalam satu tempat.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus size={16} />
          Tambah Lamaran
        </Button>
      </div>

      {/* Filters */}
      <ApplicationFilters
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table or Empty */}
      {!isLoading && applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Belum ada lamaran"
          description="Mulai tambahkan lamaran kerjamu untuk memantau progressnya."
          action={
            <Button variant="primary" onClick={openCreateModal}>
              <Plus size={16} />
              Tambah Lamaran Pertama
            </Button>
          }
        />
      ) : (
        <>
          <ApplicationTable
            applications={applications}
            isLoading={isLoading}
            onEdit={openEditModal}
            onDelete={(app) => setDeleteTarget(app)}
          />
          <Pagination meta={meta} page={page} onPageChange={setPage} />
        </>
      )}

      {/* Create / Edit Modal */}
      <ApplicationFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refetch}
        editData={editTarget}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-semibold text-ink-900">Hapus Lamaran?</h3>
            <p className="mt-2 text-sm text-ink-500">
              Lamaran ke{' '}
              <span className="font-medium text-ink-700">
                {deleteTarget.company_name}
              </span>{' '}
              sebagai{' '}
              <span className="font-medium text-ink-700">
                {deleteTarget.position}
              </span>{' '}
              akan dihapus permanen.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                isLoading={isDeleting}
                onClick={handleDelete}
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}