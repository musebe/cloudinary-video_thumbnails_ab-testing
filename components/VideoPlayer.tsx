'use client';

import { useEffect, useRef, useEffectEvent } from 'react';
import { usePostHog } from 'posthog-js/react';
import 'cloudinary-video-player/cld-video-player.min.css';

interface VideoPlayerProps {
  id: string;
  publicId: string;
  posterUrl?: string;
}

// Minimal interface for the subset of methods you use
interface CloudinaryPlayer {
  source: (publicId: string) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  dispose: () => void;
}

export default function VideoPlayer({
  id,
  publicId,
  posterUrl,
}: VideoPlayerProps) {
  const playerRef = useRef<CloudinaryPlayer | null>(null);
  const posthog = usePostHog();

  // ✅ Keeps latest values without re-running effect
  const onPlayEvent = useEffectEvent(() => {
    posthog.capture('video_played', { video_id: publicId });
  });

  useEffect(() => {
    // ✅ Define a loose browser-safe type for the dynamic import
    type CloudinaryModule = {
      default: {
        videoPlayer: (id: string, options: Record<string, unknown>) => unknown;
      };
    };

    let isMounted = true;

    import('cloudinary-video-player')
      .then((mod: CloudinaryModule) => {
        const cloudinary = mod.default;
        if (!isMounted || !cloudinary) return;

        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }

        const el = document.getElementById(id);
        if (!el) return;

        const rawPlayer = cloudinary.videoPlayer(id, {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          fluid: true,
          controls: true,
          autoplay: true,
          muted: true,
          poster: posterUrl,
        });

        // ✅ Cast safely via unknown
        const player = rawPlayer as unknown as CloudinaryPlayer;
        playerRef.current = player;

        player.source(publicId);
        player.on('play', () => onPlayEvent());
      })
      .catch((err) => {
        console.error('Failed to load Cloudinary video player:', err);
      });

    return () => {
      isMounted = false;
      playerRef.current?.dispose();
      playerRef.current = null;
    };
    // ✅ Don’t include onPlayEvent per new React rule
  }, [id, publicId, posterUrl]);

  return (
    <div className='w-full aspect-video bg-black'>
      <video id={id} className='cld-video-player cld-fluid' />
    </div>
  );
}
