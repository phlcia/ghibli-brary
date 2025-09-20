import type { Metadata } from 'next';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
import './globals.css';

const headingFont = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const bodyFont = Source_Sans_3({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ghibli-brary',
  description: 'Browse, search, and filter Studio Ghibli films.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
