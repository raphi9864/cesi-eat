import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const decodedUser = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: decodedUser.id, email: decodedUser.email, role: decodedUser.role });
      } catch (e) {
        console.error("Failed to decode token or token invalid", e);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    console.log("Login function called with:", credentials);
  
    try {
      console.log("About to make API call to:", "http://localhost:4000/api/auth/login");
      const response = await axios.post('http://localhost:4000/api/auth/login', credentials);
      console.log("API response received:", response);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error) {
      console.error("Login error in AuthContext:", error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 400) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      }
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Registration error in AuthContext:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
