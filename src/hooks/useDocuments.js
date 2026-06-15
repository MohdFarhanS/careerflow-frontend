import { useCallback, useEffect, useState } from 'react';
import documentService from '../api/documentService';
import { documentSchema, portfolioUrlSchema } from '../utils/validation/documentSchema';

/**
 * Hook untuk mengelola state dokumen user.
 *
 * Mengikuti pola cancelled flag seperti useDashboard dan useInterviews
 * untuk mencegah state update setelah komponen unmount.
 */
export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // Upload state per document_type
  const [uploadProgress, setUploadProgress] = useState({ cv: 0, portfolio: 0 });
  const [uploading, setUploading]           = useState({ cv: false, portfolio: false });
  const [uploadError, setUploadError]       = useState({ cv: null, portfolio: null });

  const fetchDocuments = useCallback(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    documentService
      .getAll()
      .then((data) => {
        if (!cancelled) setDocuments(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Gagal memuat dokumen.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    return fetchDocuments();
  }, [fetchDocuments]);

  /**
   * Upload file dengan progress tracking.
   * Replace otomatis jika tipe dokumen yang sama sudah ada.
   */
  const uploadDocument = useCallback(
    async (file, documentType) => {
      const validation = documentSchema.safeParse({ file, document_type: documentType });
      if (!validation.success) {
        const message = validation.error.issues[0]?.message ?? 'File tidak valid.';
        setUploadError((prev) => ({ ...prev, [documentType]: message }));
        return;
      }

      setUploading((prev) => ({ ...prev, [documentType]: true }));
      setUploadProgress((prev) => ({ ...prev, [documentType]: 0 }));
      setUploadError((prev) => ({ ...prev, [documentType]: null }));

      try {
        const onProgress = (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({ ...prev, [documentType]: percent }));
        };

        await documentService.upload(file, documentType, onProgress);

        // Refetch agar list dokumen ter-update dengan data terbaru dari server
        fetchDocuments();
      } catch (err) {
        const message =
          err?.response?.data?.errors?.file?.[0] ??
          err?.response?.data?.message ??
          'Gagal mengunggah dokumen.';
        setUploadError((prev) => ({ ...prev, [documentType]: message }));
      } finally {
        setUploading((prev) => ({ ...prev, [documentType]: false }));
        setUploadProgress((prev) => ({ ...prev, [documentType]: 0 }));
      }
    },
    [fetchDocuments]
  );

  /**
   * Simpan portfolio via URL eksternal (tanpa upload file).
   */
  const uploadPortfolioUrl = useCallback(
    async (url) => {
      const validation = portfolioUrlSchema.safeParse(url);
      if (!validation.success) {
        const message = validation.error.issues[0]?.message ?? 'URL tidak valid.';
        setUploadError((prev) => ({ ...prev, portfolio: message }));
        return false;
      }

      setUploading((prev) => ({ ...prev, portfolio: true }));
      setUploadError((prev) => ({ ...prev, portfolio: null }));

      try {
        await documentService.upload(null, 'portfolio', undefined, url);
        fetchDocuments();
        return true;
      } catch (err) {
        const message =
          err?.response?.data?.errors?.portfolio_url?.[0] ??
          err?.response?.data?.message ??
          'Gagal menyimpan link portfolio.';
        setUploadError((prev) => ({ ...prev, portfolio: message }));
        return false;
      } finally {
        setUploading((prev) => ({ ...prev, portfolio: false }));
      }
    },
    [fetchDocuments]
  );

  /**
   * Hapus dokumen. Refetch setelah berhasil untuk konsistensi.
   */
  const deleteDocument = useCallback(
    async (id) => {
      await documentService.delete(id);
      fetchDocuments();
    },
    [fetchDocuments]
  );

  /**
   * Helper: ambil dokumen berdasarkan tipe (cv / portfolio).
   * Return undefined jika belum ada.
   */
  const getDocumentByType = useCallback(
    (type) => documents.find((doc) => doc.document_type === type),
    [documents]
  );

  return {
    documents,
    loading,
    error,
    uploadProgress,
    uploading,
    uploadError,
    uploadDocument,
    uploadPortfolioUrl,
    deleteDocument,
    getDocumentByType,
    refetch: fetchDocuments,
  };
}