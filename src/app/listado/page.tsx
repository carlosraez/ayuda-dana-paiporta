'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HandHeart, HeartHandshake, Search, MapPin, Phone } from 'lucide-react';

// Define tipos de datos
type TipoUrgencia = 'alta' | 'media' | 'baja';
type TipoEstado = 'pendiente' | 'disponible' | 'completado';
type TipoAyuda = 'bombeo' | 'limpieza' | 'alojamiento' | 'equipos' | 'voluntariado' | 'otros';

interface SolicitudAyuda {
  id: number;
  tipo: TipoAyuda;
  descripcion: string;
  direccion: string;
  contacto: string;
  estado: TipoEstado;
  fecha: string;
  urgencia: TipoUrgencia;
}

interface OfertaAyuda {
  id: number;
  tipo: TipoAyuda;
  descripcion: string;
  disponibilidad: string;
  contacto: string;
  estado: TipoEstado;
  fecha: string;
}

type ItemAyuda = SolicitudAyuda | OfertaAyuda;

export default function ListadoPage() {
  // Datos de ejemplo
  const [solicitudes] = useState<SolicitudAyuda[]>([
    {
      id: 1,
      tipo: 'bombeo',
      descripcion: 'Necesito ayuda para bombear agua del sótano',
      direccion: 'Calle Mayor 123',
      contacto: '666555444',
      estado: 'pendiente',
      fecha: '2024-03-15',
      urgencia: 'alta'
    },
    {
      id: 2,
      tipo: 'limpieza',
      descripcion: 'Necesito ayuda para limpiar local comercial',
      direccion: 'Avenida Valencia 45',
      contacto: '666777888',
      estado: 'pendiente',
      fecha: '2024-03-15',
      urgencia: 'media'
    }
  ]);

  const [ofertas] = useState<OfertaAyuda[]>([
    {
      id: 1,
      tipo: 'voluntariado',
      descripcion: 'Disponible para ayudar en tareas de limpieza',
      disponibilidad: 'Tardes y fines de semana',
      contacto: '666999888',
      estado: 'disponible',
      fecha: '2024-03-15'
    },
    {
      id: 2,
      tipo: 'equipos',
      descripcion: 'Dispongo de bomba de agua y generador',
      disponibilidad: 'Todo el día',
      contacto: '666111222',
      estado: 'disponible',
      fecha: '2024-03-15'
    }
  ]);

  const [filtro, setFiltro] = useState<string>('');
  const [tipoFiltro, setTipoFiltro] = useState<TipoAyuda | 'todos'>('todos');

  const filtrarItems = (items: ItemAyuda[]): ItemAyuda[] => {
    return items.filter(item => 
      (tipoFiltro === 'todos' || item.tipo === tipoFiltro) &&
      (item.descripcion.toLowerCase().includes(filtro.toLowerCase()) ||
       ('direccion' in item ? item.direccion.toLowerCase().includes(filtro.toLowerCase()) : false) ||
       item.tipo.toLowerCase().includes(filtro.toLowerCase()))
    );
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Listado de Ayuda</h1>
        <p className="text-gray-600">Encuentra solicitudes y ofertas de ayuda en Paiporta</p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Buscar por descripción, dirección o tipo..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="border rounded-md px-3 py-2"
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value as TipoAyuda | 'todos')}
        >
          <option value="todos">Todos los tipos</option>
          <option value="bombeo">Bombeo</option>
          <option value="limpieza">Limpieza</option>
          <option value="alojamiento">Alojamiento</option>
          <option value="equipos">Equipos</option>
          <option value="voluntariado">Voluntariado</option>
          <option value="otros">Otros</option>
        </select>
      </div>

      {/* Pestañas */}
      <Tabs defaultValue="solicitudes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="solicitudes" className="flex items-center gap-2">
            <HandHeart size={20} /> 
            Solicitudes
          </TabsTrigger>
          <TabsTrigger value="ofertas" className="flex items-center gap-2">
            <HeartHandshake size={20} />
            Ofertas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="solicitudes">
          <div className="grid gap-4">
            {filtrarItems(solicitudes).map((solicitud) => (
              <Card key={solicitud.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          'urgencia' in solicitud && solicitud.urgencia === 'alta' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {solicitud.tipo.charAt(0).toUpperCase() + solicitud.tipo.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(solicitud.fecha).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800">{solicitud.descripcion}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {'direccion' in solicitud && (
                          <span className="flex items-center gap-1">
                            <MapPin size={16} />
                            {solicitud.direccion}
                          </span>
                        )}
                        <a 
                          href={`tel:${solicitud.contacto}`}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Phone size={16} />
                          {solicitud.contacto}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtrarItems(solicitudes).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron solicitudes que coincidan con tu búsqueda
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ofertas">
          <div className="grid gap-4">
            {filtrarItems(ofertas).map((oferta) => (
              <Card key={oferta.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          {oferta.tipo.charAt(0).toUpperCase() + oferta.tipo.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(oferta.fecha).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800">{oferta.descripcion}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {'disponibilidad' in oferta && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Disponibilidad:</span>
                            {oferta.disponibilidad}
                          </span>
                        )}
                        <a 
                          href={`tel:${oferta.contacto}`}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Phone size={16} />
                          {oferta.contacto}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtrarItems(ofertas).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron ofertas que coincidan con tu búsqueda
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}