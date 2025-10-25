'use client';

import { Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t border-border bg-background'>
      <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row md:py-8'>
        <p className='text-center text-sm text-muted-foreground md:text-left'>
          © {currentYear}{' '}
          <span className='font-medium'>Video A/B Test App</span> · Built with{' '}
          <span className='font-semibold text-foreground'>Next.js</span> &{' '}
          <span className='font-semibold text-foreground'>Cloudinary</span>
        </p>

        <Separator className='w-1/2 opacity-40 md:hidden' />

        <a
          href='https://github.com/musebe/cloudinary-video_thumbnails_ab-testing'
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
