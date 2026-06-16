import api from './axios';

export const authService = {
  async register(data) {
    const response = await api.post('/register', data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  async logout() {
    const response = await api.post('/logout');
    return response.data;
  },

  async getUser() {
    const response = await api.get('/user');
    return response.data;
  },

  async forgotPassword(data) {
    const response = await api.post('/forgot-password', data);
    return response.data;
  },

  async resetPassword(data) {
    const response = await api.post('/reset-password', data);
    return response.data;
  },
};
