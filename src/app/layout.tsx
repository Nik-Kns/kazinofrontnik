'use client';

import type {Metadata} from 'next';
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';
import { Toaster } from '@/components/ui/toaster';
import { CurrencyProvider } from '@/contexts/currency-context';
import { ChatAssistant } from '@/components/ai/chat-assistant';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/pilot';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {isLandingPage ? (
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <CurrencyProvider>
            <MainLayout>
              {children}
            </MainLayout>
            <ChatAssistant />
            <Toaster />
          </CurrencyProvider>
        )}
      </body>
    </html>
  );
}
