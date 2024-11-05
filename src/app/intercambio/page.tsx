'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, Package, Edit, Trash2, Plus, 
  Phone, Clock, Share, HandHeart,
} from 'lucide-react';

const TownResourcesExchange = () => {
  const [needs, setNeeds] = useState([
    {
      id: 1,
      item: "Medicamentos",
      details: "Necesitamos urgentemente insulina y medicamentos para la tensión",
      quantity: "20 unidades",
      priority: "alta",
      contact: "José García - 666555444",
      timePosted: "2024-03-15T10:00:00"
    },
    {
      id: 2,
      item: "Generador eléctrico",
      details: "Para mantener medicamentos refrigerados en el centro de salud",
      quantity: "2 unidades",
      priority: "alta",
      contact: "Centro de Salud - 962345678",
      timePosted: "2024-03-15T11:30:00"
    }
  ]);

  const [offers, setOffers] = useState([
    {
      id: 1,
      item: "Agua embotellada",
      details: "Disponemos de pallets de agua mineral para otros municipios",
      quantity: "2000 litros",
      available: "inmediata",
      contact: "Almacén Municipal - 962345677",
      timePosted: "2024-03-15T09:00:00"
    },
    {
      id: 2,
      item: "Mantas",
      details: "Mantas térmicas nuevas disponibles para otros municipios",
      quantity: "150 unidades",
      available: "inmediata",
      contact: "Protección Civil - 962345676",
      timePosted: "2024-03-15T12:00:00"
    }
  ]);

  const ResourceForm = ({ type, onSave, initialData = null }) => {
    const [formData, setFormData] = useState(
      initialData || {
        item: '',
        details: '',
        quantity: '',
        priority: type === 'need' ? 'media' : '',
        available: type === 'offer' ? 'inmediata' : '',
        contact: ''
      }
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({
        ...formData,
        id: initialData?.id || Date.now(),
        timePosted: new Date().toISOString()
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">¿Qué {type === 'need' ? 'necesitas' : 'ofreces'}?</label>
          <Input
            value={formData.item}
            onChange={(e) => setFormData({...formData, item: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Detalles</label>
          <Textarea
            value={formData.details}
            onChange={(e) => setFormData({...formData, details: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Cantidad</label>
          <Input
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            required
          />
        </div>

        {type === 'need' && (
          <div>
            <label className="text-sm font-medium">Prioridad</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              required
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        )}

        {type === 'offer' && (
          <div>
            <label className="text-sm font-medium">Disponibilidad</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.available}
              onChange={(e) => setFormData({...formData, available: e.target.value})}
              required
            >
              <option value="inmediata">Inmediata</option>
              <option value="24h">En 24h</option>
              <option value="48h">En 48h</option>
            </select>
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Contacto</label>
          <Input
            value={formData.contact}
            onChange={(e) => setFormData({...formData, contact: e.target.value})}
            required
            placeholder="Nombre y teléfono"
          />
        </div>

        <Button type="submit" className="w-full">
          {initialData ? 'Guardar cambios' : 'Publicar'}
        </Button>
      </form>
    );
  };

  const deleteItem = (type, id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      if (type === 'need') {
        setNeeds(needs.filter(n => n.id !== id));
      } else {
        setOffers(offers.filter(o => o.id !== id));
      }
    }
  };

  const ResourceCard = ({ data, type }) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'baja': return 'bg-green-100 text-green-800';
        case 'media': return 'bg-blue-100 text-blue-800';
        case 'alta': return 'bg-yellow-100 text-yellow-800';
        case 'urgente': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getAvailabilityColor = (available) => {
      switch (available) {
        case 'inmediata': return 'bg-green-100 text-green-800';
        case '24h': return 'bg-blue-100 text-blue-800';
        case '48h': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold">{data.item}</CardTitle>
              {type === 'need' && (
                <Badge className={getPriorityColor(data.priority)}>
                  {data.priority.toUpperCase()}
                </Badge>
              )}
              {type === 'offer' && (
                <Badge className={getAvailabilityColor(data.available)}>
                  Disponible: {data.available}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar {type === 'need' ? 'necesidad' : 'oferta'}</DialogTitle>
                  </DialogHeader>
                  <ResourceForm 
                    type={type} 
                    initialData={data}
                    onSave={(updated) => {
                      if (type === 'need') {
                        setNeeds(needs.map(n => n.id === updated.id ? updated : n));
                      } else {
                        setOffers(offers.map(o => o.id === updated.id ? updated : o));
                      }
                    }}
                  />
                </DialogContent>
              </Dialog>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => deleteItem(type, data.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{data.details}</p>
          
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Cantidad:</span>
            <span>{data.quantity}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Contacto:</span>
            <span>{data.contact}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(data.timePosted).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Intercambio de Recursos</h1>
        <p className="text-gray-600">Conectando municipios para ayudarnos mutuamente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sección de Necesidades */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold">NECESITAMOS</h2>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva necesidad
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir nueva necesidad</DialogTitle>
                </DialogHeader>
                <ResourceForm 
                  type="need"
                  onSave={(newNeed) => setNeeds([...needs, newNeed])}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            {needs.map(need => (
              <ResourceCard key={need.id} data={need} type="need" />
            ))}
          </div>
        </div>

        {/* Sección de Ofertas */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Share className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold">OFRECEMOS</h2>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva oferta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir nueva oferta</DialogTitle>
                </DialogHeader>
                <ResourceForm 
                  type="offer"
                  onSave={(newOffer) => setOffers([...offers, newOffer])}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            {offers.map(offer => (
              <ResourceCard key={offer.id} data={offer} type="offer" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <HandHeart className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-blue-700">
            Coordinación municipal para la gestión eficiente de recursos
          </span>
        </div>
      </div>
    </div>
  );
};

export default TownResourcesExchange;