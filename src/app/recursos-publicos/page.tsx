'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import PublicResourcesView from '../components/PublicReourcesView';
import { db } from '@/firebase';
import dynamic from 'next/dynamic';

// Tipos compartidos
type Priority = 'baja' | 'media' | 'alta' | 'urgente';
type Availability = 'inmediata' | '24h' | '48h';

interface BaseResourceData {
  id: string;
  item: string;
  details: string;
  quantity: number;
  contact: string;
  timePosted: string;
}

interface NeedData extends BaseResourceData {
  priority: Priority;
}

interface OfferData extends BaseResourceData {
  available: Availability;
}

// Asegurarse de que el componente se renderiza solo en el cliente
const DynamicPublicResourcesView = dynamic(
  () => import('../components/PublicReourcesView'),
  { ssr: false }
);

export default function RecursosPublicosPage() {
  const [needs, setNeeds] = useState<NeedData[]>([]);
  const [offers, setOffers] = useState<OfferData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const needsQuery = query(collection(db, 'needs'), orderBy('timePosted', 'desc'));
    const offersQuery = query(collection(db, 'offers'), orderBy('timePosted', 'desc'));

    const unsubNeeds = onSnapshot(needsQuery, (snapshot) => {
      setNeeds(
        snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            item: data.item,
            details: data.details,
            quantity: Number(data.quantity) || 0,
            contact: data.contact,
            timePosted: data.timePosted,
            priority: data.priority as Priority
          };
        })
      );
    });

    const unsubOffers = onSnapshot(offersQuery, (snapshot) => {
      setOffers(
        snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            item: data.item,
            details: data.details,
            quantity: Number(data.quantity) || 0,
            contact: data.contact,
            timePosted: data.timePosted,
            available: data.available as Availability
          };
        })
      );
      setIsLoading(false);
    });

    return () => {
      unsubNeeds();
      unsubOffers();
    };
  }, []);

  if (isLoading) {
    return <div>Cargando recursos...</div>;
  }

  return <DynamicPublicResourcesView needs={needs} offers={offers} />;
}