import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useApplicationDetail } from '../../hooks/useApplicationDetail';
import ApplicationInfoCard from './components/ApplicationInfoCard';
import NotesCard from './components/NotesCard';
import InterviewListCard from './components/InterviewListCard';
import ApplicationFormModal from './components/ApplicationFormModal';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import applicationService from '../../api/applicationService';

// Skeleton untuk detail page
function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-slate-200 rounded w-1/3" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-48 bg-slate-200 rounded-xl" />
          <div className="h-40 bg-slate-200 rounded-xl" />
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { application, loading, error, savingNotes, saveNotes, refetch } =
    useApplicationDetail(id);

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await applicationService.delete(id);
      navigate('/applications', { replace: true });
    } catch {
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  const handleAddInterview = () => {
    navigate(`/interviews?application_id=${id}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500 mb-4">{error || 'Data tidak ditemukan.'}</p>
        <Link to="/applications" className="text-indigo-600 hover:underline text-sm">
          ← Kembali ke daftar lamaran
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/applications')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setEditModal(true)}
          >
            <Edit2 size={14} className="mr-1.5" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => setDeleteModal(true)}
          >
            <Trash2 size={14} className="mr-1.5" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Kiri: Info utama + Notes */}
        <div className="lg:col-span-2 space-y-5">
          <ApplicationInfoCard application={application} />
          <NotesCard
            notes={application.notes}
            onSave={saveNotes}
            saving={savingNotes}
          />
        </div>

        {/* Kanan: Interview list */}
        <div>
          <InterviewListCard
            interviews={application.interviews || []}
            onAddInterview={handleAddInterview}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <ApplicationFormModal
          editData={application}
          onClose={() => setEditModal(false)}
          onSuccess={() => {
            setEditModal(false);
            refetch();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Hapus Lamaran"
        size="sm"
      >
        <p className="text-sm text-ink-600 mb-1">
          Yakin ingin menghapus lamaran ke{' '}
          <span className="font-semibold text-ink-900">{application.company_name}</span>?
        </p>
        <p className="text-sm text-ink-500 mb-6">
          {application.position} — tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal(false)}
            disabled={deleting}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={deleting}
          >
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}
