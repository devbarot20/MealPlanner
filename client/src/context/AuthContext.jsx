import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from local storage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      syncUser();
    } else {
      setLoading(false);
    }
  }, []);

  const syncUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data) {
        const stored = JSON.parse(localStorage.getItem('user'));
        const updatedUser = {
          ...response.data,
          token: stored?.token
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (err) {
      console.error('Failed to sync user details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const sanitizedData = {
        ...userData,
        email: userData.email ? userData.email.toLowerCase().trim() : ''
      };
      const response = await api.post('/auth/create', sanitizedData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Something went wrong during registration.' 
      };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const sanitizedData = {
        ...userData,
        email: userData.email ? userData.email.toLowerCase().trim() : ''
      };
      const response = await api.post('/auth/access', sanitizedData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid credentials.' 
      };
    }
  };

  // Toggle Favorite
  const toggleFavorite = async (recipeId) => {
    if (!user) return false;
    const isFavorite = user.favorites?.includes(recipeId);
    try {
      let response;
      if (isFavorite) {
        response = await api.delete(`/auth/favorites/${recipeId}`);
      } else {
        response = await api.post(`/auth/favorites/${recipeId}`);
      }
      const updatedUser = {
        ...user,
        favorites: response.data.favorites
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, toggleFavorite, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
