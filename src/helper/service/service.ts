import axios from 'axios';

const SERVICE_API_URL = 'http://0.0.0.0:5000/api';

export const connector = axios.create({
  baseURL: SERVICE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

connector.interceptors.request.use(
  async config => {
    const token = await localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
