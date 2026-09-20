import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('taskflow_token');
    const savedUser = localStorage.getItem('taskflow_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
      }
    }
    setLoading(false);
  }, []);

  const saveAuthSession = (tokenData, userData) => {
    setToken(tokenData);
    setUser(userData);
    localStorage.setItem('taskflow_token', tokenData);
    localStorage.setItem('taskflow_user', JSON.stringify(userData));
    setAuthError(null);
  };

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      const { data } = response.data;
      saveAuthSession(data.token, {
        _id: data._id,
        name: data.name,
        email: data.email
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify your credentials.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axiosClient.post('/auth/register', { name, email, password });
      const { data } = response.data;
      saveAuthSession(data.token, {
        _id: data._id,
        name: data.name,
        email: data.email
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    setAuthError(null);
    const demoEmail = 'alex.mercer@example.com';
    const demoPassword = 'password123';

    try {
      // Try login first
      const res = await axiosClient.post('/auth/login', {
        email: demoEmail,
        password: demoPassword
      });
      const { data } = res.data;
      saveAuthSession(data.token, {
        _id: data._id,
        name: data.name,
        email: data.email
      });
      return { success: true };
    } catch (e) {
      // If demo user doesn't exist yet, register them
      try {
        const regRes = await axiosClient.post('/auth/register', {
          name: 'Alex Mercer (Demo)',
          email: demoEmail,
          password: demoPassword
        });
        const { data } = regRes.data;
        saveAuthSession(data.token, {
          _id: data._id,
          name: data.name,
          email: data.email
        });
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.message || 'Demo login failed';
        setAuthError(msg);
        return { success: false, message: msg };
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        authError,
        login,
        register,
        demoLogin,
        logout,
        setAuthError
      }}
    >
      {children}
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
