import React, { createContext, useContext, useState, useEffect } from 'react';
import { Url } from '../../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${Url}/api/user/loaduser`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            throw new Error('Failed to load user');
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          setError(error.message || 'Failed to load user.');
        }
      } else {
        setError('No token found');
      }
      setLoading(false); 
    };

    loadUser();
  }, []);

  const register = async (userData) => {
    try {
      const response = await fetch(`${Url}/api/user/register`, {
        method: 'POST',
        body: userData, 
        headers: userData instanceof FormData ? {} : { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('token', data.token);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${Url}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('token', data.token);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setError(null); 
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
