import ClientLayout from './components/Navigation';
import './globals.css';
import { Inter } from 'next/font/google';


const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
