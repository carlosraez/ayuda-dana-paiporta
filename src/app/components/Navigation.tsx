'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {


  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {children}
      </main>
    </>
  );
}