// src/pages/Interviews/components/InterviewDeleteModal.jsx
import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';

/**
 * Konfirmasi hapus interview.
 * Pola inline confirm ini konsisten dengan ApplicationsPage
 * yang juga tidak pakai komponen Modal untuk konfirmasi delete.
 * Di sini kita pakai Modal karena konten konfirmasi lebih dari satu baris.
 */
export default function InterviewDeleteModal({ interview, onClose, onConfirm }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm(interview.id);
            onClose();
        } catch {
            setIsDeleting(false);
        }
    };

    return (
        <Modal isOpen={!!interview} onClose={onClose} title="Hapus Interview" size="sm">
            <p className="text-sm text-ink-600 mb-1">
                Yakin ingin menghapus jadwal interview ini?
            </p>
            <p className="text-sm font-medium text-ink-900 mb-6">
                {interview?.company_name} — {interview?.position}
            </p>
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                    Batal
                </Button>
                <Button variant="danger" isLoading={isDeleting} onClick={handleConfirm}>
                    Hapus
                </Button>
            </div>
        </Modal>
    );
}