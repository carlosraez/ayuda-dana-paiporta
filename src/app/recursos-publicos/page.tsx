'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import PublicResourcesView from '../components/PublicReourcesView';
import { db } from '@/firebase';

// Define interfaces for your data types
export interface ResourceData {
  id: string;
  item: string;
  details: string;
  quantity: string;
  contact: string;
  timePosted: string;
}

interface NeedData extends ResourceData {
  priority: 'baja' | 'media' | 'alta' | 'urgente';
}

interface OfferData extends ResourceData {
  available: 'inmediata' | '24h' | '48h';
}

export default function RecursosPublicosPage() {
  const [needs, setNeeds] = useState<NeedData[]>([]);
  const [offers, setOffers] = useState<OfferData[]>([]);

  useEffect(() => {
    const needsQuery = query(collection(db, 'needs'), orderBy('timePosted', 'desc'));
    const offersQuery = query(collection(db, 'offers'), orderBy('timePosted', 'desc'));

    const unsubNeeds = onSnapshot(needsQuery, (snapshot: QuerySnapshot<DocumentData>) => {
      setNeeds(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as NeedData))
      );
    });

    const unsubOffers = onSnapshot(offersQuery, (snapshot: QuerySnapshot<DocumentData>) => {
      setOffers(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as OfferData))
      );
    });

    return () => {
      unsubNeeds();
      unsubOffers();
    };
  }, []);

  return <PublicResourcesView needs={needs} offers={offers} />;
}