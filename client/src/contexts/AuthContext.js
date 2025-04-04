import React, { createContext, useState, useContext, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Vérification d\'authentification échouée', error);
      authApi.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authApi.login(credentials);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Erreur de connexion', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authApi.register(userData);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Erreur d\'inscription', error);
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateProfile = async (userId, userData) => {
    try {
      const updatedUser = await authApi.updateProfile(userId, userData);
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
