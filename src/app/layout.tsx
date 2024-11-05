// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from './components/Navigation'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DANA Paiporta - Ayuda Vecinal',
  description: 'Portal de ayuda vecinal para afectados por la DANA en Paiporta',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-gray-50 pt-4">
          {children}
        </main>
      </body>
    </html>
  )
}
