import api from './axios';

export const applicationService = {
  /**
   * Ambil list lamaran dengan filter opsional.
   * @param {Object} params - { search, status, location, sort, page }
   */
  async getSchema() {
    const response = await api.get('/applications/schema');
    return response.data;
  },

  async getAll(params = {}) {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/applications', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/applications/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },
};