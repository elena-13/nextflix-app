import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { getServerSession } from 'next-auth';

import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Providers } from './providers';
import { authOptions } from './api/auth/[...nextauth]/route';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'NextFlix',
  description: 'Movie catalog with watchlist',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased flex flex-col',
          fontSans.variable
        )}
      >
        <Providers session={session}>
          <ThemeProvider>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
