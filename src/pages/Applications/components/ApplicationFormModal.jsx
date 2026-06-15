import { useState, useEffect, useMemo } from 'react';
import Modal from '../../../components/ui/Modal';
import ApplicationForm from '../../../components/forms/ApplicationForm';
import { applicationService } from '../../../api/applicationService';

export default function ApplicationFormModal({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [fieldMeta, setFieldMeta] = useState({});
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    applicationService.getSchema()
      .then(({ fields }) => {
        if (cancelled) return;
        const meta = {};
        fields.forEach((f) => { meta[f.name] = f; });
        setFieldMeta(meta);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const isEditMode = Boolean(editData);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError(null);
    try {
      if (isEditMode) {
        await applicationService.update(editData.id, data);
      } else {
        await applicationService.create(data);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setSubmitError(err?.response?.data?.message ?? err?.userMessage ?? 'Gagal menyimpan lamaran. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format defaultValues untuk form (pastikan date format 'YYYY-MM-DD')
  const defaultValues = useMemo(() => editData
    ? {
        company_name: editData.company_name ?? '',
        position:     editData.position ?? '',
        location:     editData.location ?? '',
        job_url:      editData.job_url ?? '',
        applied_date: editData.applied_date ?? '',
        salary_range: editData.salary_range ?? '',
        status:       editData.status ?? 'Applied',
        notes:        editData.notes ?? '',
      }
    : null, [editData]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Lamaran' : 'Tambah Lamaran Baru'}
      size="lg"
    >
      {submitError && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{submitError}</p>
      )}
      <ApplicationForm
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        isLoading={isLoading}
        fieldMeta={fieldMeta}
      />
    </Modal>
  );
}