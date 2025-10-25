// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { CSPostHogProvider } from './providers';
import { ThemeProvider } from './theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Video A/B Test App',
  description: 'A/B Testing Video Thumbnails with Cloudinary and PostHog',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link
          href='https://unpkg.com/cloudinary-video-player@1.9.4/dist/cld-video-player.min.css'
          rel='stylesheet'
        />
      </head>
      
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <CSPostHogProvider>
            <div className='relative flex min-h-screen flex-col bg-background'>
              <Header />
              <main className='flex-1'>{children}</main>
              <Footer />
            </div>
          </CSPostHogProvider>
        </ThemeProvider>

        <Script
          src='https://unpkg.com/cloudinary-video-player@1.9.4/dist/cld-video-player.min.js'
          strategy='afterInteractive'
        />
      </body>
    </html>
  );
}
