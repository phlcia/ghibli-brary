import type { Metadata } from 'next';
import './globals.css';

import { SessionProvider } from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'ghibli-brary',
  description: 'Browse, search, and filter Studio Ghibli films.',
  icons: {
    icon: [
      { rel: 'icon', url: '/favicon.png', type: 'image/png', sizes: 'any' },
      { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
