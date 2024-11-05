import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, MapPin, Users, Coffee, UtensilsCrossed } from 'lucide-react';

const PuntosComidaApp = () => {
  const [puntosComida] = useState([
    {
      id: 1,
      nombre: "Polideportivo Municipal",
      direccion: "Carrer Literat Azorín, Paiporta",
      horarios: {
        desayuno: "8:00 - 10:00",
        comida: "13:00 - 15:00",
        cena: "20:00 - 22:00"
      },
      aforo: 100,
      notas: "Traer DNI y recipientes para llevar comida",
      servicios: ["Comida caliente", "Agua", "Café"]
    },
    {
      id: 2,
      nombre: "Centro Cultural",
      direccion: "Carrer Mestre Músic Vicent Prats i Tarazona, Paiporta",
      horarios: {
        desayuno: "8:30 - 10:30",
        comida: "13:30 - 15:30",
        cena: "20:30 - 22:30"
      },
      aforo: 75,
      notas: "Prioridad a familias con niños y personas mayores",
      servicios: ["Comida caliente", "Agua", "Fruta"]
    }
  ]);

  const [horarioActual, setHorarioActual] = useState(() => {
    const hora = new Date().getHours();
    if (hora >= 7 && hora < 11) return 'desayuno';
    if (hora >= 12 && hora < 16) return 'comida';
    if (hora >= 19 && hora < 23) return 'cena';
    return 'cerrado';
  });

  const [mostrarTodos, setMostrarTodos] = useState(false);

  const obtenerEstadoServicio = (punto, tipoComida) => {
    const hora = new Date().getHours();
    const [inicioHora] = punto.horarios[tipoComida].split(' - ')[0].split(':');
    const [finHora] = punto.horarios[tipoComida].split(' - ')[1].split(':');
    
    if (hora >= parseInt(inicioHora) && hora < parseInt(finHora)) {
      return 'abierto';
    }
    return 'cerrado';
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Puntos de Comida - DANA Paiporta</h1>
        
        <Alert className="mb-4">
          <AlertDescription>
            <div className="font-bold">ℹ️ Información importante</div>
            <ul className="list-disc pl-4 mt-2">
              <li>Es necesario presentar DNI o documento identificativo</li>
              <li>Se recomienda llevar recipientes propios para take-away</li>
              <li>Prioridad a familias con niños pequeños y personas mayores</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setHorarioActual('desayuno')}
            className={`flex-1 py-2 px-4 rounded ${horarioActual === 'desayuno' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            <Coffee className="inline mr-2" size={20} />
            Desayuno
          </button>
          <button 
            onClick={() => setHorarioActual('comida')}
            className={`flex-1 py-2 px-4 rounded ${horarioActual === 'comida' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            <UtensilsCrossed className="inline mr-2" size={20} />
            Comida
          </button>
          <button 
            onClick={() => setHorarioActual('cena')}
            className={`flex-1 py-2 px-4 rounded ${horarioActual === 'cena' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            <UtensilsCrossed className="inline mr-2" size={20} />
            Cena
          </button>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setMostrarTodos(!mostrarTodos)}
            className="text-sm text-blue-500 underline"
          >
            {mostrarTodos ? 'Mostrar solo horario actual' : 'Mostrar todos los horarios'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {puntosComida.map(punto => (
          <Card key={punto.id} className="mb-4">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div>
                  {punto.nombre}
                  {obtenerEstadoServicio(punto, horarioActual) === 'abierto' && (
                    <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded">
                      Abierto ahora
                    </span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="flex items-center">
                  <MapPin className="mr-2" size={20} /> {punto.direccion}
                </p>
                
                <p className="flex items-center">
                  <Users className="mr-2" size={20} /> Aforo máximo: {punto.aforo} personas
                </p>

                <div className="border rounded p-3 bg-gray-50">
                  <p className="font-bold flex items-center mb-2">
                    <Clock className="mr-2" size={20} /> Horarios:
                  </p>
                  {(mostrarTodos ? ['desayuno', 'comida', 'cena'] : [horarioActual]).map(comida => (
                    <div 
                      key={comida}
                      className={`mb-1 ${obtenerEstadoServicio(punto, comida) === 'abierto' ? 'text-green-600 font-bold' : ''}`}
                    >
                      <span className="capitalize">{comida}</span>: {punto.horarios[comida]}
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <p className="font-bold mb-1">Servicios disponibles:</p>
                  <ul className="list-disc pl-4">
                    {punto.servicios.map((servicio, index) => (
                      <li key={index}>{servicio}</li>
                    ))}
                  </ul>
                </div>

                {punto.notas && (
                  <Alert>
                    <AlertDescription>
                      <p className="text-sm">📝 {punto.notas}</p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PuntosComidaApp;