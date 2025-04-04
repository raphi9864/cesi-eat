import api from './api';

// Connexion d'un utilisateur
const login = async (credentials) => {
  try {
    const response = await api.post('/users/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Inscription d'un nouvel utilisateur
const register = async (userData) => {
  try {
    const response = await api.post('/users/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Déconnexion
const logout = () => {
  localStorage.removeItem('token');
};

// Vérifier si l'utilisateur est connecté
const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mettre à jour le profil utilisateur
const updateProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile
}; 