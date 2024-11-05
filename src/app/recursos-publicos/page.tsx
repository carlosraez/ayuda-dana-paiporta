'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import PublicResourcesView from '../components/PublicReourcesView';

export default function RecursosPublicosPage() {
  const [needs, setNeeds] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const needsQuery = query(collection(db, 'needs'), orderBy('timePosted', 'desc'));
    const offersQuery = query(collection(db, 'offers'), orderBy('timePosted', 'desc'));

    const unsubNeeds = onSnapshot(needsQuery, (snapshot) => {
      const newNeeds = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNeeds(newNeeds);
    });

    const unsubOffers = onSnapshot(offersQuery, (snapshot) => {
      const newOffers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOffers(newOffers);
      setLoading(false);
    });

    return () => {
      unsubNeeds();
      unsubOffers();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <PublicResourcesView needs={needs} offers={offers} />;
}