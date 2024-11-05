'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Definir la estructura de datos para el formulario
interface RecursoData {
  id?: number;
  tipo: string;
  nombre: string;
  descripcion: string;
  cantidad: string;
  ubicacion?: string;
  contacto?: string;
  prioridad?: string;
  zona?: string;
}

// Definir los props de AgregarRecursoForm
interface AgregarRecursoFormProps {
  onSubmit: (data: RecursoData) => void;
  tipo: string;
}

export default function AgregarRecursoForm({ onSubmit, tipo }: AgregarRecursoFormProps) {
  const [formData, setFormData] = useState<RecursoData>({
    tipo: '',
    nombre: '',
    descripcion: '',
    cantidad: '',
    ubicacion: '',
    contacto: '',
    prioridad: tipo === 'necesario' ? 'media' : undefined,
    zona: tipo === 'necesario' ? '' : undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, id: Date.now() });
    setFormData({
      tipo: '',
      nombre: '',
      descripcion: '',
      cantidad: '',
      ubicacion: '',
      contacto: '',
      prioridad: tipo === 'necesario' ? 'media' : undefined,
      zona: tipo === 'necesario' ? '' : undefined,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={`${
          tipo === 'necesario' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        }`}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Recurso {tipo === 'necesario' ? 'Necesario' : 'Disponible'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {tipo === 'necesario' ? 'Nuevo Recurso Necesario' : 'Nuevo Recurso Disponible'}
          </DialogTitle>
          <DialogDescription>
            Complete los detalles del recurso a continuación
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de recurso</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => setFormData({...formData, tipo: value})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bombeo">Bombeo</SelectItem>
                <SelectItem value="limpieza">Limpieza</SelectItem>
                <SelectItem value="alojamiento">Alojamiento</SelectItem>
                <SelectItem value="generador">Generador</SelectItem>
                <SelectItem value="transporte">Transporte</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              placeholder="Ej: Bomba de agua"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              placeholder="Describa el recurso"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cantidad">Cantidad</Label>
            <Input
              id="cantidad"
              type="number"
              value={formData.cantidad}
              onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
              placeholder="Cantidad necesaria"
              required
            />
          </div>

          {tipo === 'necesario' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="zona">Zona</Label>
                <Input
                  id="zona"
                  value={formData.zona}
                  onChange={(e) => setFormData({...formData, zona: e.target.value})}
                  placeholder="Zona donde se necesita"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select
                  value={formData.prioridad}
                  onValueChange={(value) => setFormData({...formData, prioridad: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                  placeholder="Dónde está disponible"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contacto">Contacto</Label>
                <Input
                  id="contacto"
                  value={formData.contacto}
                  onChange={(e) => setFormData({...formData, contacto: e.target.value})}
                  placeholder="Teléfono de contacto"
                  required
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className={`w-full ${
              tipo === 'necesario' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Agregar Recurso
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

