import axios from 'axios';

// Créer une instance d'Axios avec une configuration par défaut
const api = axios.create({
  baseURL: '/api', // Utiliser une URL relative qui sera dirigée par notre proxy Nginx
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur de requête pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Requête envoyée vers: ${config.method.toUpperCase()} ${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Erreur lors de la requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs communes
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Réponse reçue de: ${response.config.url} (${response.status})`);
    return response;
  },
  (error) => {
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      console.error(`❌ Erreur API (${error.response.status}):`, error.response.data);
      
      // Redirection vers la page de connexion en cas d'erreur d'authentification
      if (error.response.status === 401) {
        console.warn('🔒 Session expirée ou non autorisée, redirection vers la page de connexion');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('❌ Aucune réponse reçue du serveur:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('❌ Erreur lors de la configuration de la requête:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 