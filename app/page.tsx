//app/page.tsx

'use client';

import { useState } from 'react';
import { ABTestThumbnail } from '@/components/ABTestThumbnail';
import VideoPlayer from '@/components/VideoPlayer';
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

  const handleThumbnailClick = (clickedThumbnailUrl: string) => {
    setVideoToPlay(videoPublicId);
    setPosterUrl(clickedThumbnailUrl);
    setPlayerOpen(true);
  };

  return (
    <>
      <section className='container mx-auto max-w-4xl px-6 py-12 md:py-16 text-center space-y-4'>
        <h1 className='text-3xl md:text-4xl font-semibold tracking-tight'>
          A/B Testing Video Thumbnails
        </h1>
        <p className='text-lg text-muted-foreground'>
          Refresh the page to see a different thumbnail variant.
        </p>

        <div className='flex justify-center mt-6'>
          <ABTestThumbnail
            videoPublicId={videoPublicId}
            onThumbnailClick={handleThumbnailClick}
          />
        </div>
      </section>

      <Dialog open={isPlayerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent className='max-w-4xl w-[90vw] p-0 border-0 rounded-lg overflow-hidden'>
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
