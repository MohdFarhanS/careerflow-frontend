// src/pages/Interviews/components/InterviewCard.jsx
import {
    Calendar, Clock, Video, MapPin,
    ExternalLink, Pencil, Trash2, Briefcase
} from 'lucide-react';
import Button from '../../../components/ui/Button';

/**
 * Kartu satu interview.
 * Menampilkan semua info relevan dalam layout card yang compact.
 * Prop:
 * - interview: data dari API (sudah include company_name, position)
 * - onEdit: callback buka modal edit
 * - onDelete: callback konfirmasi + hapus
 */
export default function InterviewCard({ interview, onEdit, onDelete }) {
    const isPast = new Date(`${interview.interview_date}T${interview.interview_time}`) < new Date();

    const formattedDate = new Date(interview.interview_date + 'T00:00:00').toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = interview.interview_time?.slice(0, 5) ?? '';

    return (
        <div className={`bg-white rounded-xl border shadow-soft p-5 transition-opacity ${isPast ? 'opacity-60' : ''}`}>
            {/* Header: perusahaan + posisi + badge tipe */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-ink-900 truncate">{interview.company_name}</p>
                        <p className="text-sm text-ink-500 truncate">{interview.position}</p>
                    </div>
                </div>

                {/* Badge tipe + label sudah lewat */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${interview.interview_type === 'Online'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                    >
                        {interview.interview_type === 'Online'
                            ? <Video className="w-3 h-3" />
                            : <MapPin className="w-3 h-3" />
                        }
                        {interview.interview_type}
                    </span>
                    {isPast && (
                        <span className="text-xs text-ink-400">Sudah lewat</span>
                    )}
                </div>
            </div>

            {/* Info waktu */}
            <div className="flex flex-wrap gap-4 text-sm text-ink-600 mb-4">
                <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-ink-400" />
                    {formattedDate}
                </span>
                {formattedTime && (
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-ink-400" />
                        {formattedTime} WIB
                    </span>
                )}
            </div>

            {/* Link meeting (jika ada) */}
            {interview.meeting_url && (
                <a
                    href={interview.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 hover:underline mb-4"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Buka Link Meeting
                </a>
            )}

            {/* Catatan (jika ada) */}
            {interview.notes && (
                <p className="text-sm text-ink-500 bg-ink-50 rounded-lg px-3 py-2 mb-4 line-clamp-2">
                    {interview.notes}
                </p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-ink-100">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(interview)}
                    className="text-ink-500 hover:text-ink-900"
                >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(interview)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Hapus
                </Button>
            </div>
        </div>
    );
}