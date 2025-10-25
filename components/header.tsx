'use client';

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { PlayCircle } from 'lucide-react';

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Left Section: Logo + Title */}
        <Link href='/' className='flex items-center gap-2'>
          <PlayCircle className='h-6 w-6 text-primary' strokeWidth={2.5} />
          <span className='font-semibold text-base sm:text-lg tracking-tight'>
            Video A/B Test
          </span>
        </Link>

        {/* Right Section: Navigation + Theme */}
        <nav className='flex items-center gap-4 sm:gap-6'>
          <Link
            href='/analytics'
            className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
          >
            Analytics
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
