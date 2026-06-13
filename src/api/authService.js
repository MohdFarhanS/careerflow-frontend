import axios from 'axios';
import axiosInstance from './axios';

export const authService = {
  getCsrfCookie: () => axios.get('/sanctum/csrf-cookie', { withCredentials: true }),

  register: (data) => axiosInstance.post('/register', data),

  login: (data) => axiosInstance.post('/login', data),

  logout: () => axiosInstance.post('/logout'),

  getUser: () => axiosInstance.get('/user'),
};