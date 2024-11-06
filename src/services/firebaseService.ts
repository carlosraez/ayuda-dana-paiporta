'use client';

import { 
  collection, 
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
  DocumentReference,
  Timestamp,
  Firestore
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import firebase_app from '../firebase';

// Asegurarnos de que tenemos una instancia válida de Firestore
const db = getFirestore(firebase_app);

// Interfaces para los tipos de datos
interface BaseData {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface HelpRequestData extends BaseData {
  type: string;
  description: string;
  address: string;
  contact: string;
  urgency: 'alta' | 'media' | 'baja';
  status: 'active' | 'completed' | 'cancelled';
}

interface HelpOfferData extends BaseData {
  type: string;
  description: string;
  availability: string;
  contact: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface ResourceData extends BaseData {
  item: string;
  details: string;
  quantity: number;
  contact: string;
}

interface UserProfileData extends BaseData {
  displayName: string;
  phoneNumber: string;
}

// Tipos para las respuestas
type FirebaseResponse<T> = T & { id: string };

// Verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';

// Helper function to ensure we're on client side
const ensureClient = () => {
  if (!isClient) {
    throw new Error('This operation can only be performed on the client side');
  }
};

// Solicitudes de ayuda
export const createHelpRequest = async (data: Omit<HelpRequestData, 'createdAt' | 'status'>): Promise<DocumentReference> => {
  ensureClient();
  try {
    return await addDoc(collection(db, 'helpRequests'), {
      ...data,
      createdAt: serverTimestamp(),
      status: 'active'
    });
  } catch (error) {
    console.error('Error creating help request:', error);
    throw error;
  }
};

export const updateHelpRequest = async (id: string, data: Partial<HelpRequestData>): Promise<void> => {
  ensureClient();
  try {
    const docRef = doc(db, 'helpRequests', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating help request:', error);
    throw error;
  }
};

export const deleteHelpRequest = async (id: string): Promise<void> => {
  ensureClient();
  try {
    const docRef = doc(db, 'helpRequests', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting help request:', error);
    throw error;
  }
};

// Ofertas de ayuda
export const createHelpOffer = async (data: Omit<HelpOfferData, 'createdAt' | 'status'>): Promise<DocumentReference> => {
  ensureClient();
  try {
    return await addDoc(collection(db, 'helpOffers'), {
      ...data,
      createdAt: serverTimestamp(),
      status: 'active'
    });
  } catch (error) {
    console.error('Error creating help offer:', error);
    throw error;
  }
};

export const updateHelpOffer = async (id: string, data: Partial<HelpOfferData>): Promise<void> => {
  ensureClient();
  try {
    const docRef = doc(db, 'helpOffers', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating help offer:', error);
    throw error;
  }
};

export const deleteHelpOffer = async (id: string): Promise<void> => {
  ensureClient();
  try {
    const docRef = doc(db, 'helpOffers', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting help offer:', error);
    throw error;
  }
};

// Recursos
export const createResource = async (data: Omit<ResourceData, 'createdAt'>): Promise<DocumentReference> => {
  ensureClient();
  try {
    return await addDoc(collection(db, 'resources'), {
      ...data,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

export const updateResource = async (id: string, data: Partial<ResourceData>): Promise<void> => {
  ensureClient();
  try {
    const docRef = doc(db, 'resources', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
};

export const deleteResource = async (id: string): Promise<void> => {
  ensureClient();
  try {
    const docRef = doc(db, 'resources', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
};

// Consultas
export const getActiveHelpRequests = async (): Promise<FirebaseResponse<HelpRequestData>[]> => {
  ensureClient();
  try {
    const q = query(
      collection(db, 'helpRequests'),
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseResponse<HelpRequestData>[];
  } catch (error) {
    console.error('Error getting active help requests:', error);
    throw error;
  }
};

export const getActiveHelpOffers = async (): Promise<FirebaseResponse<HelpOfferData>[]> => {
  ensureClient();
  try {
    const q = query(
      collection(db, 'helpOffers'),
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseResponse<HelpOfferData>[];
  } catch (error) {
    console.error('Error getting active help offers:', error);
    throw error;
  }
};

export const getResources = async (): Promise<FirebaseResponse<ResourceData>[]> => {
  ensureClient();
  try {
    const querySnapshot = await getDocs(collection(db, 'resources'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseResponse<ResourceData>[];
  } catch (error) {
    console.error('Error getting resources:', error);
    throw error;
  }
};

// Funciones auxiliares para usuarios
export const createUserProfile = async (uid: string, data: Partial<UserProfileData>): Promise<void> => {
  ensureClient();
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  ensureClient();
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};