// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { auth } from '@/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  getIdToken: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        setLoading(false);

        // Si hay un usuario, obtener y almacenar el token
        if (user) {
          const token = await user.getIdToken();
          localStorage.setItem('firebase-token', token);
        } else {
          localStorage.removeItem('firebase-token');
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const signOut = async () => {
    try {
      if (auth) {
        await firebaseSignOut(auth);
        localStorage.removeItem('firebase-token');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      const token = await user.getIdToken(true);
      localStorage.setItem('firebase-token', token);
      return token;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// utils/auth.ts
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('firebase-token');
};

// Función para agregar el token a las solicitudes fetch
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};