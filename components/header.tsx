// components/header.tsx
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='container flex h-14 max-w-screen-2xl items-center justify-between'>
        {/* Left side - Site Title/Logo */}
        <Link href='/' className='mr-6 flex items-center space-x-2'>
          {/* You can replace this with an SVG logo if you prefer */}
          <span className='font-bold sm:inline-block'>Video A/B Test</span>
        </Link>

        {/* Right side - Navigation / Theme Toggle */}
        <nav className='flex items-center gap-4'>
          {/* Link to Analytics page */}
          <Link
            href='/analytics'
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
          >
            Analytics
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
