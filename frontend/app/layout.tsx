import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cyber-Guard AI - Content Moderation Engine',
  description: 'AI-powered content moderation with multilingual support and multi-category harm detection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #1a237e 40%, #0d1b3e 100%)', backgroundAttachment: 'fixed', minHeight: '100vh' }}>
        <Navigation />
        <main>{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15,23,42,0.95)',
              color: '#e2e8f0',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
