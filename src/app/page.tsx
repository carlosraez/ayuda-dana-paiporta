'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { HandHeart, HeartHandshake, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleNavigation = (path: string) => {
    if (!user && (path.includes('/ayuda/necesito') || path.includes('/ayuda/ofrezco'))) {
      router.push('/login');
    } else {
      router.push(path);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Banner de Emergencia */}
      <Alert className="mb-6 border-red-500 bg-red-50">
        <AlertDescription>
          <div className="font-bold text-red-600 flex items-center">
            <AlertCircle className="mr-2" /> Emergencia DANA Paiporta
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span>Emergencias:</span>
              <a href="tel:112" className="text-blue-600 font-bold">112</a>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Opciones Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <button 
          onClick={() => handleNavigation('/ayuda/necesito')}
          className="text-left transform hover:scale-102 transition-transform"
        >
          <Card className="h-full bg-red-50 hover:shadow-lg transition-shadow border-red-200">
            <CardHeader className="text-center pb-2">
              <HandHeart className="w-16 h-16 mx-auto text-red-500 mb-2" />
              <CardTitle className="text-2xl text-red-700">Necesito Ayuda</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-red-700">
                <li className="flex items-center">• Solicitar ayuda para limpieza</li>
                <li className="flex items-center">• Necesito bombeo de agua</li>
                <li className="flex items-center">• Necesito alojamiento</li>
                <li className="flex items-center">• Otras necesidades urgentes</li>
              </ul>
              <div className="mt-4 text-center">
                <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg">
                  {!user ? 'Acceder para Pedir Ayuda' : 'Pedir Ayuda'}
                </span>
              </div>
            </CardContent>
          </Card>
        </button>

        <button 
          onClick={() => handleNavigation('/ayuda/ofrezco')}
          className="text-left transform hover:scale-102 transition-transform"
        >
          <Card className="h-full bg-green-50 hover:shadow-lg transition-shadow border-green-200">
            <CardHeader className="text-center pb-2">
              <HeartHandshake className="w-16 h-16 mx-auto text-green-500 mb-2" />
              <CardTitle className="text-2xl text-green-700">Ofrezco Ayuda</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-center">• Ofrecer alojamiento</li>
                <li className="flex items-center">• Ayuda con limpieza</li>
                <li className="flex items-center">• Préstamo de equipos</li>
                <li className="flex items-center">• Voluntariado</li>
              </ul>
              <div className="mt-4 text-center">
                <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg">
                  {!user ? 'Acceder para Ofrecer Ayuda' : 'Ofrecer Ayuda'}
                </span>
              </div>
            </CardContent>
          </Card>
        </button>
      </div>
    </div>
  );
}
