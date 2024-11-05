'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './../../src/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Aquí podrías cargar datos adicionales del usuario desde Firestore si lo necesitas
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserProfile = async (profile) => {
    if (!user) throw new Error('No hay usuario autenticado');

    try {
      // Actualizar displayName en Firebase Auth
      await user.updateProfile({
        displayName: profile.displayName,
      });

      // Guardar datos adicionales en Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        displayName: profile.displayName,
        phoneNumber: user.phoneNumber,
        createdAt: profile.createdAt,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  const value = {
    user,
    signOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}