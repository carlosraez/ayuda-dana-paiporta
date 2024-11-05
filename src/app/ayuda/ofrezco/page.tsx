'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HeartHandshake, Home, Brush, Wrench, Users } from 'lucide-react';

export default function OfrezcoAyuda() {
  const [ofertas, setOfertas] = useState([]);
  const [newOferta, setNewOferta] = useState({
    tipo: '',
    descripcion: '',
    disponibilidad: '',
    contacto: '',
    estado: 'disponible'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setOfertas([...ofertas, { ...newOferta, id: Date.now() }]);
    setNewOferta({
      tipo: '',
      descripcion: '',
      disponibilidad: '',
      contacto: '',
      estado: 'disponible'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center">
        <HeartHandshake className="mr-2" /> Ofrezco Ayuda
      </h1>

      {/* Formulario de oferta */}
      <Card className="mb-8 border-green-200">
        <CardHeader>
          <CardTitle className="text-xl text-green-700">Nueva Oferta de Ayuda</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Ayuda</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={newOferta.tipo}
                onChange={(e) => setNewOferta({...newOferta, tipo: e.target.value})}
                required
              >
                <option value="">Seleccione tipo de ayuda</option>
                <option value="alojamiento">Ofrecer Alojamiento</option>
                <option value="limpieza">Ayuda con Limpieza</option>
                <option value="equipos">Préstamo de Equipos</option>
                <option value="voluntariado">Voluntariado</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <Textarea 
                value={newOferta.descripcion}
                onChange={(e) => setNewOferta({...newOferta, descripcion: e.target.value})}
                placeholder="Describa qué tipo de ayuda puede ofrecer"
                required
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Disponibilidad</label>
              <Input 
                value={newOferta.disponibilidad}
                onChange={(e) => setNewOferta({...newOferta, disponibilidad: e.target.value})}
                placeholder="¿Cuándo está disponible?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contacto</label>
              <Input 
                value={newOferta.contacto}
                onChange={(e) => setNewOferta({...newOferta, contacto: e.target.value})}
                placeholder="Teléfono o email"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Publicar Oferta
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de ofertas */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Mis Ofertas de Ayuda</h2>
        
        {ofertas.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="text-center p-6 text-gray-500">
              No hay ofertas de ayuda activas
            </CardContent>
          </Card>
        ) : (
          ofertas.map((oferta) => (
            <Card key={oferta.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-green-700">
                      {oferta.tipo.charAt(0).toUpperCase() + oferta.tipo.slice(1)}
                    </h3>
                    <p className="text-gray-600 mt-1">{oferta.descripcion}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      🕒 {oferta.disponibilidad}
                    </p>
                    <p className="text-sm text-gray-500">
                      📞 {oferta.contacto}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    oferta.estado === 'disponible' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {oferta.estado.charAt(0).toUpperCase() + oferta.estado.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}