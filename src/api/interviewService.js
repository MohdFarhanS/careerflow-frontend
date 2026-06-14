// src/api/interviewService.js
import api from './axios';

/**
 * Semua call ke /api/interviews.
 * Pola konsisten dengan applicationService.js:
 * - fungsi async yang return data langsung (bukan response object)
 * - error dibiarkan propagate ke caller (hook/component yang handle)
 */

export const interviewService = {
    /**
     * Ambil semua interview dengan filter opsional.
     * @param {Object} params - { upcoming, application_id, interview_type, sort, page }
     */
    getAll: async (params = {}) => {
        const { data } = await api.get('/interviews', { params });
        return data; // { data: [...], meta: {...}, links: {...} }
    },

    /**
     * Buat interview baru.
     * @param {Object} payload - { application_id, interview_date, interview_time, interview_type, meeting_url, notes }
     */
    create: async (payload) => {
        const { data } = await api.post('/interviews', payload);
        return data; // { message, interview }
    },

    /**
     * Update interview.
     * @param {number} id
     * @param {Object} payload
     */
    update: async (id, payload) => {
        const { data } = await api.put(`/interviews/${id}`, payload);
        return data; // { message, interview }
    },

    /**
     * Hapus interview.
     * @param {number} id
     */
    delete: async (id) => {
        const { data } = await api.delete(`/interviews/${id}`);
        return data; // { message }
    },
};