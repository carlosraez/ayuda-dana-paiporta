'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

import PublicResourcesView from '../components/PublicReourcesView';
import { db } from '@/firebase';

export default function RecursosPublicosPage() {
  const [needs, setNeeds] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const needsQuery = query(collection(db, 'needs'), orderBy('timePosted', 'desc'));
    const offersQuery = query(collection(db, 'offers'), orderBy('timePosted', 'desc'));

    const unsubNeeds = onSnapshot(needsQuery, (snapshot) => {
      setNeeds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubOffers = onSnapshot(offersQuery, (snapshot) => {
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubNeeds();
      unsubOffers();
    };
  }, []);

  return <PublicResourcesView needs={needs} offers={offers} />;
}