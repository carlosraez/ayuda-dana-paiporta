// src/app/components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Clock, HomeIcon, Search, Package2, ArrowLeftRight, 
  LogOut, User, AlertCircle, Heart, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

// Definición de tipos para los enlaces
type NavLink = {
  href: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  requiresAuth: boolean;
};

// Enlaces públicos (siempre visibles)
const publicLinks: NavLink[] = [
  {
    href: '/',
    label: 'Inicio',
    icon: <HomeIcon className="w-4 h-4" />,
    color: 'text-gray-600 hover:text-gray-900',
    requiresAuth: false,
  },
  {
    href: '/recursos-publicos',
    label: 'Ver Recursos Disponibles',
    icon: <Eye className="w-4 h-4" />,
    color: 'text-purple-600 hover:text-purple-700',
    requiresAuth: false,
  },
];

// Enlaces protegidos (requieren autenticación)
const protectedLinks: NavLink[] = [
  {
    href: '/ayuda/necesito',
    label: 'Necesito Ayuda',
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'text-red-600 hover:text-red-700',
    requiresAuth: true,
  },
  {
    href: '/ayuda/ofrezco',
    label: 'Ofrezco Ayuda',
    icon: <Heart className="w-4 h-4" />,
    color: 'text-green-600 hover:text-green-700',
    requiresAuth: true,
  },
  {
    href: '/intercambio',
    label: 'Gestionar Intercambios',
    icon: <ArrowLeftRight className="w-4 h-4" />,
    color: 'text-purple-600 hover:text-purple-700',
    requiresAuth: true,
  },
  {
    href: '/recursos',
    label: 'Recursos',
    icon: <Package2 className="w-4 h-4" />,
    color: 'text-orange-600 hover:text-orange-700',
    requiresAuth: true,
  },
  {
    href: '/listado',
    label: 'Ver Listado',
    icon: <Search className="w-4 h-4" />,
    color: 'text-blue-600 hover:text-blue-700',
    requiresAuth: true,
  },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

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
            {/* Enlaces públicos siempre visibles */}
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1 ${link.color} ${
                  pathname === link.href ? 'font-semibold' : ''
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Enlaces protegidos solo visibles con autenticación */}
            {user && protectedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1 ${link.color} ${
                  pathname === link.href ? 'font-semibold' : ''
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Sección de usuario */}
            {user ? (
              <div className="flex items-center space-x-4 border-l pl-4">
                <Link 
                  href="/perfil" 
                  className={`flex items-center space-x-1 ${
                    pathname === '/perfil' ? 'font-semibold' : ''
                  }`}
                >
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
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 border-l pl-4"
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



