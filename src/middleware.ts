// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import admin from '../firebaseAdmin'; // Ajusta la ruta según corresponda

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verifica la cookie de sesión
    await admin.auth().verifySessionCookie(sessionCookie, true);
    return NextResponse.next();
  } catch (error) {
    console.error('Error al verificar la cookie de sesión:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/ayuda/:path*',
    '/intercambio',
    '/recursos',
    '/listado',
    '/perfil',
  ],
};
