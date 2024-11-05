// contexts/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  onAuthStateChanged,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: any;
  userProfile: any;
  loading: boolean;
  error: string | null;
  signIn: (phone: string, appVerifier: any) => Promise<any>;
  signOut: () => Promise<void>;
  updateUserProfile: (userData: any) => Promise<boolean>;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthContextProvider');
  }
  return context;
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateUserProfile = async (userData: any) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...userData,
        phoneNumber: user.phoneNumber,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setUserProfile(prevProfile => ({
        ...prevProfile,
        ...userData
      }));

      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const loadUserProfile = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserProfile(userSnap.data());
      } else {
        const basicProfile = {
          phoneNumber: user?.phoneNumber,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, basicProfile);
        setUserProfile(basicProfile);
      }
    } catch (err: any) {
      console.error('Error al cargar el perfil:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user);
          await loadUserProfile(user.uid);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (err: any) {
        console.error('Error en auth state change:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (phone: string, appVerifier: any) => {
    try {
      setError(null);
      const formattedPhone = phone.startsWith('+34') ? phone : '+34' + phone.replace(/\D/g, '');
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      return confirmationResult;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value = useMemo(() => ({
    user,
    userProfile,
    loading,
    error,
    signIn,
    signOut,
    updateUserProfile,
    clearError,
    isAuthenticated: !!user,
  }), [user, userProfile, loading, error]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;