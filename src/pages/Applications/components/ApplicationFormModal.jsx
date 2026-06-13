import { useState, useEffect } from 'react';
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

  useEffect(() => {
    applicationService.getSchema().then(({ fields }) => {
      const meta = {};
      fields.forEach((f) => { meta[f.name] = f; });
      setFieldMeta(meta);
    });
  }, []);

  const isEditMode = Boolean(editData);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isEditMode) {
        await applicationService.update(editData.id, data);
      } else {
        await applicationService.create(data);
      }
      onSuccess();
      onClose();
    } catch (err) {
      // Error ditangani di level atas atau bisa ditambahkan toast notif
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format defaultValues untuk form (pastikan date format 'YYYY-MM-DD')
  const defaultValues = editData
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
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Lamaran' : 'Tambah Lamaran Baru'}
      size="lg"
    >
      <ApplicationForm
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        isLoading={isLoading}
        fieldMeta={fieldMeta}
      />
    </Modal>
  );
}