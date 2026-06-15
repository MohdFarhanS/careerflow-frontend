import { FileText, AlertCircle } from 'lucide-react';
import { useDocuments } from '../../hooks/useDocuments';
import UploadCard from './components/UploadCard';

const DOC_TYPES = [
  {
    type: 'cv',
    label: 'Curriculum Vitae (CV)',
    description: 'Resume atau daftar riwayat hidup kamu dalam format PDF.',
  },
  {
    type: 'portfolio',
    label: 'Portfolio',
    description: 'Kumpulan karya atau proyek yang ingin kamu tampilkan ke rekruiter.',
  },
];

export default function DocumentsPage() {
  const {
    loading,
    error,
    uploading,
    uploadProgress,
    uploadError,
    uploadDocument,
    uploadPortfolioUrl,
    deleteDocument,
    getDocumentByType,
  } = useDocuments();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-ink-900">Dokumen Saya</h1>
        </div>
        <p className="text-ink-500 text-sm ml-12">
          Unggah CV dan portfolio kamu. Setiap tipe dokumen hanya menyimpan satu versi terbaru.
        </p>
      </div>

      {/* Error global */}
      {error && (
        <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Skeleton loading */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-ink-200 shadow-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-ink-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-ink-100 rounded animate-pulse w-1/3" />
                  <div className="h-3 bg-ink-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
              <div className="h-24 bg-ink-50 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        // Grid kartu upload
        <div className="flex flex-col gap-4">
          {DOC_TYPES.map(({ type, label, description }) => (
            <UploadCard
              key={type}
              type={type}
              label={label}
              description={description}
              document={getDocumentByType(type)}
              isUploading={uploading[type]}
              progress={uploadProgress[type]}
              error={uploadError[type]}
              onUpload={uploadDocument}
              onUploadUrl={type === 'portfolio' ? uploadPortfolioUrl : undefined}
              onDelete={deleteDocument}
            />
          ))}
        </div>
      )}

      {/* Info footer */}
      <p className="text-xs text-ink-400 text-center mt-8">
        File tersimpan dengan aman dan hanya bisa diakses oleh kamu.
      </p>
    </div>
  );
}