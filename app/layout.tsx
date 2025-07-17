import type { Metadata } from 'next'
import './globals.css'
import AppShell from '../components/AppShell';
import { ThemeProvider } from '../components/theme-provider';

export const metadata: Metadata = {
  title: 'Hotel Dashboard',
  description: 'Dashboard de correlación de precios hoteleros con eventos',
  generator: 'Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell />
        </ThemeProvider>
      </body>
    </html>
  );
}
