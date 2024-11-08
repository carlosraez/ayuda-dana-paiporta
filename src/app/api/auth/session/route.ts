// pages/api/auth/session/route.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../../../../firebaseAdmin'; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Método no permitido
  }

  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'No se proporcionó el idToken' });
  }

  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días

    // Verifica el idToken y crea una cookie de sesión
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    const options = {
      maxAge: expiresIn / 1000, // En segundos
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax' as const,
    };

    // Establece la cookie de sesión
    res.setHeader(
      'Set-Cookie',
      `session=${sessionCookie}; Path=/; HttpOnly; Max-Age=${options.maxAge}; ${
        options.secure ? 'Secure;' : ''
      } SameSite=${options.sameSite};`
    );

    return res.status(200).json({ message: 'Sesión establecida correctamente' });
  } catch (error) {
    console.error('Error al crear la cookie de sesión:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
}

