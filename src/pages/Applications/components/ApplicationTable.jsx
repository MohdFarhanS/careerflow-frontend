import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom'; // â† TAMBAH INI
import Badge from '../../../components/ui/Badge';
import SkeletonRow from '../../../components/ui/SkeletonRow';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ActionMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({
        top: rect.bottom + 4,
        left: rect.right - 144,
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="Aksi untuk lamaran"
        className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && createPortal(
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed z-50 w-36 rounded-xl border border-ink-100 bg-white shadow-lg py-1"
            style={{ top: position.top, left: position.left }}
          >
            <button
              onClick={() => { setOpen(false); onEdit(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={() => { setOpen(false); onDelete(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              Hapus
            </button>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

export default function ApplicationTable({
  applications,
  isLoading,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate(); // â† TAMBAH INI

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-100 bg-ink-50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
              Perusahaan
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
              Posisi
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500 hidden md:table-cell">
              Lokasi
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500 hidden sm:table-cell">
              Tanggal
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-500">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 bg-white">
          {isLoading ? (
            <>
              <SkeletonRow cols={6} />
              <SkeletonRow cols={6} />
              <SkeletonRow cols={6} />
              <SkeletonRow cols={6} />
              <SkeletonRow cols={6} />
            </>
          ) : (
            applications.map((app) => (
              <tr
                key={app.id}
                onClick={() => navigate(`/applications/${app.id}`)} // â† TAMBAH INI
                className="hover:bg-ink-50/50 transition-colors cursor-pointer" // â† TAMBAH cursor-pointer
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink-900">{app.company_name}</span>
                    {app.job_url && (
                      <a
                        href={app.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-ink-400 hover:text-primary-600 transition-colors"
                        aria-label="Buka link lowongan"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-700">{app.position}</td>
                <td className="px-4 py-3 text-ink-500 hidden md:table-cell">
                  {app.location || 'â€”'}
                </td>
                <td className="px-4 py-3 text-ink-500 hidden sm:table-cell">
                  {formatDate(app.applied_date)}
                </td>
                <td className="px-4 py-3">
                  <Badge status={app.status} />
                </td>
                <td
                  className="px-4 py-3 text-right"
                  onClick={(e) => e.stopPropagation()} // â† TAMBAH INI
                >
                  <ActionMenu
                    onEdit={() => onEdit(app)}
                    onDelete={() => onDelete(app)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}