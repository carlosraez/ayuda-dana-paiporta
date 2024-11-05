'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, HomeIcon, Search, Package2, ArrowLeftRight, LogOut, User } from 'lucide-react';

import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="border-b">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-red-600" />
            <span className="font-semibold text-xl">DANA Paiporta</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Inicio</span>
            </Link>
            
            <Link
              href="/ayuda/necesito"
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <span>Necesito Ayuda</span>
            </Link>
            
            <Link
              href="/ayuda/ofrezco"
              className="flex items-center space-x-1 text-green-600 hover:text-green-700"
            >
              <span>Ofrezco Ayuda</span>
            </Link>

            <Link
              href="/intercambio"
              className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Intercambio</span>
            </Link>
            
            <Link
              href="/recursos"
              className="flex items-center space-x-1 text-orange-600 hover:text-orange-700"
            >
              <Package2 className="w-4 h-4" />
              <span>Recursos</span>
            </Link>
            
            <Link
              href="/listado"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
            >
              <Search className="w-4 h-4" />
              <span>Ver Listado</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/perfil" className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{user.phoneNumber}</span>
                </Link>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </Button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <User className="w-4 h-4" />
                <span>Acceder</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

function useAuth(): { user: any; signOut: any; } {
  throw new Error('Function not implemented.');
}
