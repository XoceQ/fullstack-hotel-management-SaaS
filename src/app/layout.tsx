'use client';


import { SessionProvider } from 'next-auth/react';
import './globals.css';

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen h-full" suppressHydrationWarning>
         <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}