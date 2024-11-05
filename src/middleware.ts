// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = [
  '/ayuda/necesito',
  '/ayuda/ofrezco',
  '/intercambio',
  '/recursos',
  '/listado',
  '/perfil'
];

// Rutas públicas
const publicRoutes = ['/', '/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Si la ruta requiere autenticación y no hay token, redirige al login
  if (protectedRoutes.includes(pathname) && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Si está autenticado e intenta acceder al login, redirige a inicio
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/ayuda/:path*',
    '/intercambio',
    '/recursos',
    '/listado',
    '/perfil',
  ],
};