'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA_9zaLy2Q7kG4kQZQZ7-aZESfUByaSx_Y",
  authDomain: "danavalencia-792af.firebaseapp.com",
  projectId: "danavalencia-792af",
  storageBucket: "danavalencia-792af.firebasestorage.app",
  messagingSenderId: "1006831667214",
  appId: "1:1006831667214:web:743266a5235bc15835545f",
  measurementId: "G-J3JSQ07VCP"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = typeof window !== 'undefined' ? getAuth(firebase_app) : null;
export const db = typeof window !== 'undefined' ? getFirestore(firebase_app) : null;

// Initialize Analytics and export it
export const analytics = typeof window !== 'undefined' ? 
  isSupported().then(yes => yes ? getAnalytics(firebase_app) : null) : 
  null;

export default firebase_app;