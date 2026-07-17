import axios from 'axios';

const isProd = import.meta.env.PROD;
const api = axios.create({
  baseURL: isProd ? 'https://meal-planner-sutl-r5ckx8y49-devbarot20s-projects.vercel.app/api' : '/api'
});

// Intercept requests to add the auth token if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
