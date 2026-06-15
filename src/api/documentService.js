import api from './axios';

const documentService = {
  /**
   * GET /api/documents
   * Ambil semua dokumen milik user.
   */
  getAll() {
    return api.get('/documents').then((res) => res.data.data ?? res.data);
  },

  /**
   * POST /api/documents
   * Upload dokumen. Mendukung dua mode untuk portfolio:
   * - file: upload PDF (wajib untuk CV)
   * - portfolioUrl: simpan URL eksternal (hanya untuk portfolio)
   *
   * @param {File|null} file - File object dari input, atau null jika pakai URL
   * @param {'cv' | 'portfolio'} documentType - Tipe dokumen
   * @param {Function} [onUploadProgress] - Callback untuk progress bar (hanya jika ada file)
   * @param {string|null} [portfolioUrl] - URL eksternal portfolio
   */
  upload(file, documentType, onUploadProgress, portfolioUrl) {
    const formData = new FormData();
    formData.append('document_type', documentType);
    if (file) formData.append('file', file);
    if (portfolioUrl) formData.append('portfolio_url', portfolioUrl);

    return api
      .post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        ...(file ? { onUploadProgress } : {}),
      })
      .then((res) => res.data);
  },

  /**
   * DELETE /api/documents/{id}
   */
  delete(id) {
    return api.delete(`/documents/${id}`).then((res) => res.data);
  },
};

export default documentService;