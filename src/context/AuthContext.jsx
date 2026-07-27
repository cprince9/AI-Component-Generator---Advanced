import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('genu_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('genu_token') || null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/auth';

  // Save token & user to localStorage whenever they change
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('genu_user', JSON.stringify(user));
      localStorage.setItem('genu_token', token);
    } else {
      localStorage.removeItem('genu_user');
      localStorage.removeItem('genu_token');
    }
  }, [user, token]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser({ _id: data._id, name: data.name, email: data.email });
      setToken(data.token);
      toast.success(`Welcome back, ${data.name}! 🚀`);
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser({ _id: data._id, name: data.name, email: data.email });
      setToken(data.token);
      toast.success(`Account created! Welcome to GenU, ${data.name}! ✨`);
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    toast.info('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
