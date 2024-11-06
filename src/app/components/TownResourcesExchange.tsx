'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Share, } from 'lucide-react';

// Datos de ejemplo
const initialNeeds = [
  {
    id: 1,
    item: "Medicamentos",
    details: "Necesitamos insulina y tensiómetros",
    contact: "Centro Salud - 666555444",
    priority: "alta"
  }
];

const initialOffers = [
  {
    id: 1,
    item: "Agua embotellada",
    details: "2000 litros disponibles",
    contact: "Almacén Municipal - 962345677",
    available: "inmediata"
  }
];

const TownResourcesExchange = () => {
  const [needs, setNeeds] = useState(initialNeeds);
  const [offers ] = useState(initialOffers);

  // Formulario simple para crear nuevas necesidades
  const AddNeedForm = () => {
    const [formData, setFormData] = useState({
      item: '',
      details: '',
      contact: '',
      priority: 'media'
    });

    const handleSubmit = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      const newNeed = {
        id: Date.now(),
        ...formData
      };
      setNeeds([...needs, newNeed]);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          placeholder="¿Qué necesitas?"
          value={formData.item}
          onChange={(e) => setFormData({...formData, item: e.target.value})}
        />
        <Input 
          placeholder="Detalles"
          value={formData.details}
          onChange={(e) => setFormData({...formData, details: e.target.value})}
        />
        <Input 
          placeholder="Contacto"
          value={formData.contact}
          onChange={(e) => setFormData({...formData, contact: e.target.value})}
        />
        <Button type="submit">Añadir Necesidad</Button>
      </form>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Intercambio de Recursos</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sección NECESITAMOS */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="text-red-500 w-6 h-6" />
            <h2 className="text-xl font-bold">NECESITAMOS</h2>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full mb-4">+ Nueva Necesidad</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nueva Necesidad</DialogTitle>
              </DialogHeader>
              <AddNeedForm />
            </DialogContent>
          </Dialog>

          {needs.map(need => (
            <Card key={need.id} className="mb-4">
              <CardHeader>
                <CardTitle>{need.item}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{need.details}</p>
                <p className="text-sm mt-2">Contacto: {need.contact}</p>
                <p className="text-sm text-red-600">Prioridad: {need.priority}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sección OFRECEMOS */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Share className="text-green-500 w-6 h-6" />
            <h2 className="text-xl font-bold">OFRECEMOS</h2>
          </div>

          {offers.map(offer => (
            <Card key={offer.id} className="mb-4">
              <CardHeader>
                <CardTitle>{offer.item}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{offer.details}</p>
                <p className="text-sm mt-2">Contacto: {offer.contact}</p>
                <p className="text-sm text-green-600">
                  Disponibilidad: {offer.available}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TownResourcesExchange;