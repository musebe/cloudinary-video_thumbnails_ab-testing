'use client';

import { useState, useEffect, useEffectEvent } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryVideo } from '@cloudinary/url-gen';
import { usePostHog } from 'posthog-js/react';
import { cld } from '@/lib/cloudinary';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { PlayCircle } from 'lucide-react';

interface ABTestThumbnailProps {
  videoPublicId: string;
  onThumbnailClick: (thumbnailUrl: string) => void;
}

export const ABTestThumbnail = ({
  videoPublicId,
  onThumbnailClick,
}: ABTestThumbnailProps) => {
  const [variant, setVariant] = useState<string | null>(null);
  const posthog = usePostHog();

  // Prebuild both variants
  const thumbnailA = cld
    .video(videoPublicId)
    .setVersion(1)
    .resize(fill().width(1280).height(720))
    .roundCorners(byRadius(15))
    .addTransformation('so_2,f_jpg,q_auto');

  const thumbnailB = cld
    .video(videoPublicId)
    .setVersion(1)
    .resize(fill().width(1280).height(720))
    .roundCorners(byRadius(15))
    .addTransformation(
      'l_text:Arial_60_bold:New%20Episode!,co_rgb:FFFFFF,b_rgb:00000090/fl_layer_apply,g_south_east,x_20,y_20/so_8,f_jpg,q_auto'
    );

  const variants: Record<string, CloudinaryVideo> = {
    A: thumbnailA,
    B: thumbnailB,
  };

  // ✅ UseEffectEvent separates event logic from render
  const pickVariantEvent = useEffectEvent(() => {
    const assigned = Math.random() < 0.5 ? 'A' : 'B';
    setVariant(assigned);
    posthog.capture('thumbnail_impression', {
      video_id: videoPublicId,
      variant: assigned,
    });
  });

  useEffect(() => {
    pickVariantEvent();
  }, []);

  const handleClick = () => {
    if (!variant) return;
    posthog.capture('thumbnail_clicked', {
      video_id: videoPublicId,
      variant,
    });

    const thumbnailUrl = variants[variant].toURL();
    onThumbnailClick(thumbnailUrl);
  };

  if (!variant) {
    return (
      <div className='aspect-video w-full max-w-2xl animate-pulse rounded-xl bg-slate-700'></div>
    );
  }

  return (
    <Card
      onClick={handleClick}
      className='w-full max-w-2xl mx-auto overflow-hidden rounded-xl shadow-lg transition-transform duration-200 ease-in-out hover:scale-[1.02] hover:shadow-2xl cursor-pointer border-2 bg-white group'
    >
      <CardContent className='p-2 sm:p-4 relative'>
        <div className='relative rounded-xl overflow-hidden aspect-video bg-slate-200'>
          <AdvancedImage
            cldImg={variants[variant]}
            className='w-full h-full object-cover'
          />

          {/* Always visible overlay, slightly brighter on hover */}
          <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-90 group-hover:opacity-100 transition-opacity duration-300'>
            <PlayCircle
              size={70}
              className='text-white drop-shadow-lg mb-3'
              strokeWidth={1.5}
            />
            <p className='text-white text-lg font-semibold drop-shadow'>
              Click to play the video
            </p>
          </div>

          <Badge
            variant='secondary'
            className='absolute top-3 right-3 bg-white/90 text-slate-800'
          >
            Variant: {variant}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
