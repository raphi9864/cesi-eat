import axios from 'axios';

// Determine the base URL for the API
// For development (local or Docker accessed via localhost), target the API gateway directly.
// In a production build, '/api' would likely be handled by a reverse proxy (like Nginx)
// serving the frontend and proxying to the API gateway.
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:4000/api'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Add timeout for better error handling
  withCredentials: false, // Explicitly set to false for CORS requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for logging in development
apiClient.interceptors.request.use(config => {
  console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

export default apiClient; 