import { 
    collection, 
    addDoc, 
    updateDoc,
    deleteDoc,
    doc, 
    query,
    where,
    getDocs,
    serverTimestamp 
  } from 'firebase/firestore';
  import { db } from '../firebase';
  
  // Solicitudes de ayuda
  export const createHelpRequest = async (data) => {
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
  
  export const updateHelpRequest = async (id, data) => {
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
  
  export const deleteHelpRequest = async (id) => {
    try {
      const docRef = doc(db, 'helpRequests', id);
      await deleteDoc(docRef);
    } catch (error) {
      throw error;
    }
  };
  
  // Ofertas de ayuda
  export const createHelpOffer = async (data) => {
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
  
  export const updateHelpOffer = async (id, data) => {
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
  
  export const deleteHelpOffer = async (id) => {
    try {
      const docRef = doc(db, 'helpOffers', id);
      await deleteDoc(docRef);
    } catch (error) {
      throw error;
    }
  };
  
  // Recursos
  export const createResource = async (data) => {
    try {
      return await addDoc(collection(db, 'resources'), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  };
  
  export const updateResource = async (id, data) => {
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
  
  export const deleteResource = async (id) => {
    try {
      const docRef = doc(db, 'resources', id);
      await deleteDoc(docRef);
    } catch (error) {
      throw error;
    }
  };
  
  // Consultas
  export const getActiveHelpRequests = async () => {
    try {
      const q = query(
        collection(db, 'helpRequests'),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  };
  
  export const getActiveHelpOffers = async () => {
    try {
      const q = query(
        collection(db, 'helpOffers'),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  };
  
  export const getResources = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'resources'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  };
  
  // Funciones auxiliares para usuarios
  export const createUserProfile = async (uid, data) => {
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
  
  export const getUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      throw error;
    }
  };