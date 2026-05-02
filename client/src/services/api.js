import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const stored = JSON.parse(localStorage.getItem('devpulse-auth') || '{}');
  const token = stored?.state?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const stored = JSON.parse(localStorage.getItem('devpulse-auth') || '{}');
        const refreshToken = stored?.state?.refreshToken;
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post('/api/auth/refresh', { refreshToken });

        const current = JSON.parse(localStorage.getItem('devpulse-auth') || '{}');
        current.state.accessToken = data.accessToken;
        current.state.refreshToken = data.refreshToken;
        localStorage.setItem('devpulse-auth', JSON.stringify(current));

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('devpulse-auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;