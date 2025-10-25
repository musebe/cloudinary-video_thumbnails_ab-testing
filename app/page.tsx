// app/page.tsx
'use client';

import { useState } from 'react';
import { ABTestThumbnail } from '@/components/ABTestThumbnail';
import VideoPlayer from '@/components/VideoPlayer';
// ✅ 1. Import the missing components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function HomePage() {
  const [isPlayerOpen, setPlayerOpen] = useState(false);
  const [videoToPlay, setVideoToPlay] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  const videoPublicId = 'samples/elephants';

  // This function is called by the thumbnail component when it's clicked
  const handleThumbnailClick = (clickedThumbnailUrl: string) => {
    setVideoToPlay(videoPublicId);
    setPosterUrl(clickedThumbnailUrl); // Set the poster to the clicked variant
    setPlayerOpen(true);
  };

  return (
    <>
      <main className='flex min-h-screen flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900'>
        <div className='container mx-auto text-center'>
          <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-slate-50'>
            A/B Testing Video Thumbnails
          </h1>
          <p className='mb-8 text-lg text-slate-600 dark:text-slate-400'>
            Refresh the page to see a different thumbnail variant.
          </p>

          <ABTestThumbnail
            videoPublicId={videoPublicId}
            onThumbnailClick={handleThumbnailClick}
          />
        </div>
      </main>

      <Dialog open={isPlayerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent className='max-w-4xl w-[90vw] p-0 border-0 rounded-lg overflow-hidden'>
          {/* ✅ 2. Add the required Header, Title, and Description */}
          {/* The 'sr-only' class hides them visually but keeps them for screen readers */}
          <DialogHeader className='sr-only'>
            <DialogTitle>Video Player</DialogTitle>
            <DialogDescription>
              A modal containing the video player for the selected content.
            </DialogDescription>
          </DialogHeader>

          {videoToPlay && (
            <VideoPlayer
              id='cloudinary-player'
              publicId={videoToPlay}
              posterUrl={posterUrl}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
