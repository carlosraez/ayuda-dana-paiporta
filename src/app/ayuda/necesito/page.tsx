'use client';

import * as React from "react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HandHeart } from "lucide-react";
  // Asegúrate de que la ruta de importación sea correcta
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";

// Define el tipo para las solicitudes
interface Solicitud {
  id: number;
  tipo: string;
  descripcion: string;
  direccion: string;
  contacto: string;
  estado: string;
}

function NecesitoAyudaContent() {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [newSolicitud, setNewSolicitud] = useState<Solicitud>({
    id: 0,
    tipo: "",
    descripcion: "",
    direccion: "",
    contacto: user?.phoneNumber || "",
    estado: "pendiente",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSolicitudes([...solicitudes, { ...newSolicitud, id: Date.now() }]);
    setNewSolicitud({
      id: 0,
      tipo: "",
      descripcion: "",
      direccion: "",
      contacto: user?.phoneNumber || "",
      estado: "pendiente",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-red-700 mb-6 flex items-center">
        <HandHeart className="mr-2" /> Necesito Ayuda
      </h1>

      {/* Formulario de solicitud */}
      <Card className="mb-8 border-red-200">
        <CardHeader>
          <CardTitle className="text-xl text-red-700">Nueva Solicitud de Ayuda</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Ayuda</label>
              <select
                className="w-full p-2 border rounded-md"
                value={newSolicitud.tipo}
                onChange={(e) => setNewSolicitud({ ...newSolicitud, tipo: e.target.value })}
                required
              >
                <option value="">Seleccione tipo de ayuda</option>
                <option value="bombeo">Bombeo de Agua</option>
                <option value="limpieza">Limpieza</option>
                <option value="alojamiento">Alojamiento Temporal</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <Textarea
                value={newSolicitud.descripcion}
                onChange={(e) => setNewSolicitud({ ...newSolicitud, descripcion: e.target.value })}
                placeholder="Describa su necesidad en detalle"
                required
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Dirección</label>
              <Input
                value={newSolicitud.direccion}
                onChange={(e) => setNewSolicitud({ ...newSolicitud, direccion: e.target.value })}
                placeholder="Calle, número, piso..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contacto</label>
              <Input
                value={newSolicitud.contacto}
                onChange={(e) => setNewSolicitud({ ...newSolicitud, contacto: e.target.value })}
                placeholder="Teléfono o email"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              Enviar Solicitud
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de solicitudes */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Mis Solicitudes</h2>

        {solicitudes.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="text-center p-6 text-gray-500">
              No hay solicitudes activas
            </CardContent>
          </Card>
        ) : (
          solicitudes.map((solicitud) => (
            <Card key={solicitud.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-red-700">
                      {solicitud.tipo.charAt(0).toUpperCase() + solicitud.tipo.slice(1)}
                    </h3>
                    <p className="text-gray-600 mt-1">{solicitud.descripcion}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      📍 {solicitud.direccion}
                    </p>
                    <p className="text-sm text-gray-500">
                      📞 {solicitud.contacto}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      solicitud.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
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

export default function NecesitoAyuda() {
  return (
    <ProtectedRoute>
      <NecesitoAyudaContent />
    </ProtectedRoute>
  );
}
