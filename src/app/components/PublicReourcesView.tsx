'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Package, Phone, Clock, Share, HandHeart } from 'lucide-react';

// Vista pública de solo lectura
const PublicResourcesView = ({ needs, offers }) => {
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
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold">NECESITAMOS</h2>
          </div>
          <div className="space-y-4">
            {needs.map(need => (
              <ResourceCard key={need.id} data={need} type="need" />
            ))}
          </div>
        </div>

        {/* Sección de Ofertas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Share className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold">OFRECEMOS</h2>
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

export default PublicResourcesView;