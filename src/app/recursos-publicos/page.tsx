'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import PublicResourcesView from '../components/PublicReourcesView';
import { db } from '@/firebase';
import { NeedData, OfferData } from '../types/resourcers';


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
          ...doc.data(),
          quantity: Number(doc.data().quantity) || 0
        } as NeedData))
      );
    });

    const unsubOffers = onSnapshot(offersQuery, (snapshot: QuerySnapshot<DocumentData>) => {
      setOffers(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          quantity: Number(doc.data().quantity) || 0
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