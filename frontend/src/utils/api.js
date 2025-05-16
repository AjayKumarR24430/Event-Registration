import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle case where response doesn't exist (network error, server down, etc.)
    if (!error.response) {
      return Promise.reject({
        response: {
          data: {
            error: 'Network error - please check your connection or try again later'
          }
        }
      });
    }

    const { status } = error.response;
    
    // Handle token expiration or invalid token, but not login failures
    if (status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;