'use client';

import { Separator } from '@/components/ui/separator';
import { Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full border-t border-border bg-background'>
      <div className='container flex flex-col items-center justify-between gap-4 py-6 md:flex-row md:py-8'>
        {/* Left: text */}
        <p className='text-center text-sm text-muted-foreground md:text-left'>
          © {currentYear}{' '}
          <span className='font-medium'>Video A/B Test App</span> · Built with{' '}
          <span className='font-semibold text-foreground'>Next.js</span> &{' '}
          <span className='font-semibold text-foreground'>Cloudinary</span>
        </p>

        {/* Divider (visible only on mobile) */}
        <Separator className='w-1/2 md:hidden opacity-40' />

        {/* Right: GitHub link or future icons */}
        <a
          href='https://github.com'
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <Github className='w-4 h-4' />
          <span>View Source</span>
        </a>
      </div>
    </footer>
  );
}
