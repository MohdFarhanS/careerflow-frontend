import api from './axios';

export const dashboardService = {
    getSummary: async () => {
        const { data } = await api.get('/dashboard');
        return data;
    },
};