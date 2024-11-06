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
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

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

// Solicitudes de ayuda
export const createHelpRequest = async (data: Omit<HelpRequestData, 'createdAt' | 'status'>): Promise<DocumentReference> => {
  try {
    return await addDoc(collection(db, 'helpRequests'), {
      ...data,
      createdAt: serverTimestamp(),
      status: 'active'
    });
  } catch (error) {
    throw error;
  }
};

export const updateHelpRequest = async (id: string, data: Partial<HelpRequestData>): Promise<void> => {
  try {
    const docRef = doc(db, 'helpRequests', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

export const deleteHelpRequest = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'helpRequests', id);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
};

// Ofertas de ayuda
export const createHelpOffer = async (data: Omit<HelpOfferData, 'createdAt' | 'status'>): Promise<DocumentReference> => {
  try {
    return await addDoc(collection(db, 'helpOffers'), {
      ...data,
      createdAt: serverTimestamp(),
      status: 'active'
    });
  } catch (error) {
    throw error;
  }
};

export const updateHelpOffer = async (id: string, data: Partial<HelpOfferData>): Promise<void> => {
  try {
    const docRef = doc(db, 'helpOffers', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

export const deleteHelpOffer = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'helpOffers', id);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
};

// Recursos
export const createResource = async (data: Omit<ResourceData, 'createdAt'>): Promise<DocumentReference> => {
  try {
    return await addDoc(collection(db, 'resources'), {
      ...data,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

export const updateResource = async (id: string, data: Partial<ResourceData>): Promise<void> => {
  try {
    const docRef = doc(db, 'resources', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

export const deleteResource = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'resources', id);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
};

// Consultas
export const getActiveHelpRequests = async (): Promise<FirebaseResponse<HelpRequestData>[]> => {
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
    throw error;
  }
};

export const getActiveHelpOffers = async (): Promise<FirebaseResponse<HelpOfferData>[]> => {
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
    throw error;
  }
};

export const getResources = async (): Promise<FirebaseResponse<ResourceData>[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'resources'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseResponse<ResourceData>[];
  } catch (error) {
    throw error;
  }
};

// Funciones auxiliares para usuarios
export const createUserProfile = async (uid: string, data: Partial<UserProfileData>): Promise<void> => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    throw error;
  }
};