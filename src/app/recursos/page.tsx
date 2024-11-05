'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Package2, Search, AlertTriangle, CheckCircle2, 
  MapPin, Phone, Clock, Edit, Trash2, Plus, Save,
  AlertCircle, MoveDown, MoveUp
} from 'lucide-react';

const EmergencyResourcesDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState([
    {
      id: 1,
      name: "Generadores eléctricos",
      total: 5,
      available: 2,
      inUse: 3,
      locations: [
        { id: 1, name: "Hospital Central", quantity: 2 },
        { id: 2, name: "Centro de Evacuación", quantity: 1 }
      ],
      contact: "112-345-678",
      status: "parcial"
    },
    {
      id: 2,
      name: "Bombas de agua",
      total: 8,
      available: 3,
      inUse: 5,
      locations: [
        { id: 1, name: "Zona Norte", quantity: 3 },
        { id: 2, name: "Zona Sur", quantity: 2 }
      ],
      contact: "112-345-679",
      status: "crítico"
    }
  ]);

  const [editingResource, setEditingResource] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewLocationDialogOpen, setIsNewLocationDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', quantity: 1 });

  const ResourceForm = ({ resource, onSave, isNew = false }) => {
    const [formData, setFormData] = useState(
      resource || {
        name: '',
        total: 0,
        available: 0,
        inUse: 0,
        contact: '',
        locations: [],
        status: 'disponible'
      }
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
      setIsEditDialogOpen(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre del recurso</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Total</label>
            <Input
              type="number"
              value={formData.total}
              onChange={(e) => setFormData({...formData, total: parseInt(e.target.value)})}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Disponibles</label>
            <Input
              type="number"
              value={formData.available}
              onChange={(e) => setFormData({...formData, available: parseInt(e.target.value)})}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">En uso</label>
            <Input
              type="number"
              value={formData.inUse}
              onChange={(e) => setFormData({...formData, inUse: parseInt(e.target.value)})}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Contacto</label>
          <Input
            value={formData.contact}
            onChange={(e) => setFormData({...formData, contact: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="disponible">Disponible</option>
            <option value="parcial">Parcial</option>
            <option value="crítico">Crítico</option>
          </select>
        </div>

        <Button type="submit" className="w-full">
          {isNew ? 'Crear recurso' : 'Guardar cambios'}
        </Button>
      </form>
    );
  };

  const LocationForm = ({ resourceId }) => {
    const handleSubmit = (e) => {
      e.preventDefault();
      const resource = resources.find(r => r.id === resourceId);
      const updatedLocations = [...resource.locations, {...newLocation, id: Date.now()}];
      
      updateResource({
        ...resource,
        locations: updatedLocations,
        inUse: resource.inUse + parseInt(newLocation.quantity),
        available: resource.available - parseInt(newLocation.quantity)
      });
      
      setNewLocation({ name: '', quantity: 1 });
      setIsNewLocationDialogOpen(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Ubicación</label>
          <Input
            value={newLocation.name}
            onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Cantidad</label>
          <Input
            type="number"
            min="1"
            value={newLocation.quantity}
            onChange={(e) => setNewLocation({...newLocation, quantity: parseInt(e.target.value)})}
            required
          />
        </div>
        <Button type="submit" className="w-full">Añadir ubicación</Button>
      </form>
    );
  };

  const addResource = (newResource) => {
    setResources([...resources, { ...newResource, id: Date.now() }]);
  };

  const updateResource = (updatedResource) => {
    setResources(resources.map(r => 
      r.id === updatedResource.id ? updatedResource : r
    ));
  };

  const deleteResource = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
      setResources(resources.filter(r => r.id !== id));
    }
  };

  const removeLocation = (resourceId, locationId) => {
    const resource = resources.find(r => r.id === resourceId);
    const location = resource.locations.find(l => l.id === locationId);
    
    const updatedResource = {
      ...resource,
      locations: resource.locations.filter(l => l.id !== locationId),
      inUse: resource.inUse - location.quantity,
      available: resource.available + location.quantity
    };
    
    updateResource(updatedResource);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'parcial': return 'bg-yellow-100 text-yellow-800';
      case 'crítico': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.locations.some(loc => loc.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Estado de Recursos de Emergencia</h1>
          <p className="text-gray-600">Monitoreo en tiempo real de recursos disponibles y en uso</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo recurso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir nuevo recurso</DialogTitle>
            </DialogHeader>
            <ResourceForm onSave={addResource} isNew={true} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por recurso o ubicación..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(resource => (
          <Card key={resource.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">{resource.name}</CardTitle>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar recurso</DialogTitle>
                      </DialogHeader>
                      <ResourceForm resource={resource} onSave={updateResource} />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteResource(resource.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Badge className={getStatusColor(resource.status)}>
                {resource.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Disponibles</div>
                  <div className="text-2xl font-bold text-green-600">{resource.available}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">En uso</div>
                  <div className="text-2xl font-bold text-blue-600">{resource.inUse}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-2xl font-bold">{resource.total}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Ubicaciones en uso:</span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Añadir ubicación</DialogTitle>
                      </DialogHeader>
                      <LocationForm resourceId={resource.id} />
                    </DialogContent>
                  </Dialog>
                </div>
                {resource.locations.map((location) => (
                  <div key={location.id} className="ml-6 text-sm flex justify-between items-center">
                    <span>{location.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{location.quantity} unid.</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeLocation(resource.id, location.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Contacto:</span>
                <span>{resource.contact}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-blue-700">
            Última actualización: Hace 5 minutos
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResourcesDashboard;