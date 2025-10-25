import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CSPostHogProvider } from './providers';
import Script from 'next/script';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Video A/B Test',
  description: 'Next.js + Cloudinary A/B thumbnails',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <head>
        <link
          href='https://cdn.jsdelivr.net/npm/cloudinary-video-player@3.4.2/dist/cld-video-player.min.css'
          rel='stylesheet'
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}
      >
        <CSPostHogProvider>
          {/* Page shell */}
          <div className='flex min-h-screen flex-col'>
            <Header />
            <main className='flex-1'>{children}</main>
            <Footer />
          </div>
        </CSPostHogProvider>

        <Script
          src='https://cdn.jsdelivr.net/npm/cloudinary-video-player@3.4.2/dist/cld-video-player.min.js'
          strategy='afterInteractive'
        />
      </body>
    </html>
  );
}
