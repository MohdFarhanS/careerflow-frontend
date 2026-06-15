// src/pages/Interviews/components/InterviewFormModal.jsx
import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import InterviewForm from '../../../components/forms/InterviewForm';

/**
 * Wrapper Modal untuk form interview.
 * Menangani:
 * - State isSubmitting & submitError
 * - Pemanggilan onSave (create atau update dari hook)
 * - Menutup modal setelah sukses
 *
 * Prop `interview` diisi saat mode edit (berisi data interview yang akan diedit).
 * Prop `onSave` adalah fungsi async dari useInterviews (createInterview / updateInterview).
 */
export default function InterviewFormModal({ isOpen, onClose, interview, onSave }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const isEdit = !!interview;

    // Siapkan defaultValues untuk mode edit
    const defaultValues = isEdit ? {
        application_id: interview.application_id,
        interview_date: interview.interview_date,
        // interview_time dari backend: "10:00:00" → kita ambil 5 karakter pertama "10:00"
        interview_time: interview.interview_time?.slice(0, 5) ?? '',
        interview_type: interview.interview_type,
        meeting_url: interview.meeting_url ?? '',
        notes: interview.notes ?? '',
    } : undefined;

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            if (isEdit) {
                // Update tidak kirim application_id (backend tidak izinkan ubah)
                // eslint-disable-next-line no-unused-vars
                const { application_id: _application_id, ...updatePayload } = formData;
                await onSave(interview.id, updatePayload);
            } else {
                await onSave(formData);
            }
            onClose();
        } catch (err) {
            const message = err?.response?.data?.message
                || (err?.response?.data?.errors
                    ? Object.values(err.response.data.errors).flat().join(' ')
                    : null)
                || err?.userMessage
                || 'Terjadi kesalahan. Coba lagi.';
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Interview' : 'Tambah Interview'}
            size="md"
        >
            <InterviewForm
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitError={submitError}
            />
        </Modal>
    );
}