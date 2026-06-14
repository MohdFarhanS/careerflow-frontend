import api from './axios';

export const dashboardService = {
  getSummary: () => api.get('/dashboard').then((res) => res.data),
};