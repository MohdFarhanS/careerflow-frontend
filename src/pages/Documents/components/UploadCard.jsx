import { useRef, useState } from 'react';
import { FileText, Upload, Trash2, ExternalLink, CheckCircle, Link, X } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';
import { portfolioUrlSchema } from '../../../utils/validation/documentSchema';

export default function UploadCard({
  type,           // 'cv' | 'portfolio'
  label,
  description,
  document,       // data dokumen dari API (undefined jika belum ada)
  isUploading,
  progress,
  error,
  onUpload,
  onUploadUrl,    // hanya dipass untuk portfolio; undefined untuk CV
  onDelete,
}) {
  const inputRef      = useRef(null);
  const [isDragOver, setIsDragOver]     = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError]   = useState(null);

  // Hanya relevan untuk portfolio (ketika onUploadUrl tersedia)
  const [mode, setMode]         = useState('file'); // 'file' | 'link'
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState(null);
  // isReplacing: true ketika user klik "Ganti" di kartu yang sudah ada dokumen URL
  const [isReplacing, setIsReplacing] = useState(false);

  const supportsLink = Boolean(onUploadUrl);
  const isPortfolioUrl = document?.portfolio_url && !document?.file_url;

  const handleFileSelect = (file) => {
    if (!file) return;
    onUpload(file, type);
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleSaveUrl = async () => {
    // Validasi inline di komponen agar error muncul langsung di bawah input
    const trimmed = urlInput.trim();
    const result = portfolioUrlSchema.safeParse(trimmed);
    if (!result.success) {
      setUrlError(result.error.issues[0]?.message ?? 'URL tidak valid.');
      return;
    }
    setUrlError(null);
    const success = await onUploadUrl(trimmed);
    if (success) {
      setUrlInput('');
      setMode('file');
      setIsReplacing(false);
    }
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setUrlInput('');
    setUrlError(null);
  };

  const handleCancelReplace = () => {
    setIsReplacing(false);
    setUrlInput('');
    setUrlError(null);
    setMode('file');
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-ink-200 shadow-card p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-900">{label}</h3>
            <p className="text-xs text-ink-500 mt-0.5">{description}</p>
          </div>
        </div>

        {document && !isUploading && !isReplacing && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full shrink-0">
            <CheckCircle className="w-3 h-3" />
            Terunggah
          </span>
        )}
      </div>

      {/* Konten utama */}
      {document && !isUploading && !isReplacing ? (
        <div className="flex flex-col gap-3">
          {isPortfolioUrl ? (
            // State: portfolio disimpan sebagai URL
            <div className="flex items-start gap-3 p-3 rounded-xl bg-ink-50 border border-ink-100">
              <Link className="w-4 h-4 text-ink-400 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-800 truncate">{document.portfolio_url}</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  Disimpan {formatDate(document.created_at)}
                </p>
              </div>
            </div>
          ) : (
            // State: dokumen disimpan sebagai file
            <div className="flex items-start gap-3 p-3 rounded-xl bg-ink-50 border border-ink-100">
              <FileText className="w-4 h-4 text-ink-400 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-800 truncate">{document.file_name}</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  {formatFileSize(document.file_size)} · Diunggah {formatDate(document.created_at)}
                </p>
              </div>
            </div>
          )}

          {/* Aksi */}
          <div className="flex items-center gap-2">
            {isPortfolioUrl ? (
              <a
                href={document.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full gap-2 text-xs">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Lihat Portfolio
                </Button>
              </a>
            ) : (
              <a
                href={document.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full gap-2 text-xs">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Lihat PDF
                </Button>
              </a>
            )}

            <Button
              variant="outline"
              className="flex-1 gap-2 text-xs"
              onClick={() => {
                if (isPortfolioUrl) {
                  setIsReplacing(true);
                  setMode('link');
                  setUrlInput(document.portfolio_url);
                  setUrlError(null);
                } else {
                  inputRef.current?.click();
                }
              }}
            >
              <Upload className="w-3.5 h-3.5" />
              Ganti
            </Button>

            {deleteConfirm ? (
              <div className="flex gap-1">
                <Button
                  variant="danger"
                  className="text-xs px-3"
                  onClick={async () => {
                    try {
                      await onDelete(document.id);
                      setDeleteConfirm(false);
                      setDeleteError(null);
                    } catch {
                      setDeleteError('Gagal menghapus dokumen. Coba lagi.');
                      setDeleteConfirm(false);
                    }
                  }}
                >
                  Hapus
                </Button>
                <Button
                  variant="ghost"
                  className="text-xs px-3"
                  onClick={() => setDeleteConfirm(false)}
                >
                  Batal
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="text-ink-400 hover:text-red-500 hover:bg-red-50 p-2"
                onClick={() => setDeleteConfirm(true)}
                title="Hapus dokumen"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ) : isUploading ? (
        // State: sedang upload / menyimpan
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-600">
              {mode === 'link' ? 'Menyimpan link...' : 'Mengunggah...'}
            </span>
            {mode !== 'link' && (
              <span className="text-primary-600 font-medium">{progress}%</span>
            )}
          </div>
          {mode !== 'link' && (
            <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <p className="text-xs text-ink-500">Mohon tunggu, jangan tutup halaman ini.</p>
        </div>
      ) : (
        // State: belum ada dokumen
        <div className="flex flex-col gap-3">
          {/* Tab toggle — hanya untuk portfolio */}
          {supportsLink && (
            <div className="flex rounded-lg border border-ink-200 overflow-hidden text-xs font-medium">
              <button
                type="button"
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors',
                  mode === 'file'
                    ? 'bg-primary-50 text-primary-700 border-r border-ink-200'
                    : 'bg-white text-ink-500 hover:bg-ink-50 border-r border-ink-200'
                )}
                onClick={() => handleSwitchMode('file')}
              >
                <FileText className="w-3.5 h-3.5" />
                Upload File PDF
              </button>
              <button
                type="button"
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors',
                  mode === 'link'
                    ? 'bg-primary-50 text-primary-700'
                    : 'bg-white text-ink-500 hover:bg-ink-50'
                )}
                onClick={() => handleSwitchMode('link')}
              >
                <Link className="w-3.5 h-3.5" />
                Gunakan Link URL
              </button>
            </div>
          )}

          {mode === 'link' ? (
            // Mode link
            <div className="flex flex-col gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (urlError) setUrlError(null);
                }}
                placeholder="https://github.com/username/project"
                className={cn(
                  'w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-ink-900 placeholder:text-ink-400 outline-none transition-colors',
                  'focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
                  urlError ? 'border-red-400' : 'border-ink-200'
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveUrl();
                }}
              />
              {urlError && (
                <p className="text-xs text-red-600">{urlError}</p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  className="flex-1"
                  isLoading={isUploading}
                  onClick={handleSaveUrl}
                >
                  Simpan Link
                </Button>
                {isReplacing && (
                  <Button
                    variant="ghost"
                    className="px-3"
                    onClick={handleCancelReplace}
                    title="Batal ganti"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            // Mode file — drop zone
            <div
              className={cn(
                'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer',
                isDragOver
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-ink-200 bg-ink-50 hover:border-primary-300 hover:bg-primary-50/50'
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
            >
              <div className="w-10 h-10 rounded-full bg-white border border-ink-200 flex items-center justify-center shadow-soft">
                <Upload className="w-5 h-5 text-ink-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-ink-700">
                  Drag & drop atau{' '}
                  <span className="text-primary-600 underline underline-offset-2">pilih file</span>
                </p>
                <p className="text-xs text-ink-500 mt-1">PDF saja · Maksimal 5MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {(error || deleteError) && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {deleteError ?? error}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
