'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Clock, HomeIcon, Search, Package2, ArrowLeftRight, 
  LogOut, User, AlertCircle, Heart, Eye, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '@/contexts/AuthContext';

// Interfaces
interface AuthContextType {
  user: {
    phoneNumber: string;
  } | null;
}

// Definición de tipos para los enlaces
type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
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
  const { user } = useAuth() as AuthContextType;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    console.log('cerrar sesion');
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Enlaces públicos */}
      {publicLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center space-x-1 ${link.color} ${
            pathname === link.href ? 'font-semibold' : ''
          } ${mobile ? 'py-2' : ''}`}
          onClick={() => mobile && setIsOpen(false)}
        >
          {link.icon}
          <span>{link.label}</span>
        </Link>
      ))}

      {/* Enlaces protegidos */}
      {user && protectedLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center space-x-1 ${link.color} ${
            pathname === link.href ? 'font-semibold' : ''
          } ${mobile ? 'py-2' : ''}`}
          onClick={() => mobile && setIsOpen(false)}
        >
          {link.icon}
          <span>{link.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <nav className="border-b">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-red-600" />
            <span className="font-semibold text-xl">DANA Paiporta</span>
          </Link>
          
          {/* Enlaces para desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks />

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

          {/* Menú móvil */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks mobile />
                  
                  <div className="border-t pt-4">
                    {user ? (
                      <>
                        <Link
                          href="/perfil"
                          className="flex items-center space-x-2 py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>{user.phoneNumber}</span>
                        </Link>
                        <Button
                          variant="ghost"
                          className="flex items-center space-x-2 w-full justify-start p-2"
                          onClick={() => {
                            handleSignOut();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Salir</span>
                        </Button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        className="flex items-center space-x-2 py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Acceder</span>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
