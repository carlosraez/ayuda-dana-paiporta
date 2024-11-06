'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import { ReactNode } from 'react';

interface ClientLayoutProps {
  children: ReactNode;
}


export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <Navbar />
      {children}
    </AuthProvider>
  );
}