'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';


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