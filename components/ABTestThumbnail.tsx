// components/ABTestThumbnail.tsx
'use client';

import { useState, useEffect } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryVideo } from '@cloudinary/url-gen';
import { usePostHog } from 'posthog-js/react';
import { cld } from '@/lib/cloudinary';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// --- We only need basic imports now ---
import { fill } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';

interface ABTestThumbnailProps {
  videoPublicId: string;
}

export const ABTestThumbnail = ({ videoPublicId }: ABTestThumbnailProps) => {
  const [variant, setVariant] = useState<string | null>(null);
  const posthog = usePostHog();

  // --- Defining Variants ---

  // Variant A: Thumbnail from the 2-second mark.
  const thumbnailA = cld
    .video(videoPublicId)
    .setVersion(1)
    .resize(fill().width(1280).height(720))
    .roundCorners(byRadius(15))
    .addTransformation('so_2,f_jpg,q_auto');

  // Variant B: Thumbnail from the 8-second mark with overlay.
  const thumbnailB = cld
    .video(videoPublicId)
    .setVersion(1)
    .resize(fill().width(1280).height(720))
    .roundCorners(byRadius(15))
    // ✅ FIX: Replaced the .overlay() builder with a raw transformation string.
    // This string creates the text, color, background, and positions the overlay.
    .addTransformation(
      'l_text:Arial_60_bold:New%20Episode!,co_rgb:FFFFFF,b_rgb:00000090/fl_layer_apply,g_south_east,x_20,y_20/so_8,f_jpg,q_auto'
    );

  const variants: { [key: string]: CloudinaryVideo } = {
    A: thumbnailA,
    B: thumbnailB,
  };

  // ... (The rest of the component remains the same)

  useEffect(() => {
    const assignedVariant = Math.random() < 0.5 ? 'A' : 'B';
    setVariant(assignedVariant);
    posthog.capture('thumbnail_impression', {
      video_id: videoPublicId,
      variant: assignedVariant,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoPublicId]);

  const handleClick = () => {
    if (!variant) return;
    posthog.capture('thumbnail_clicked', {
      video_id: videoPublicId,
      variant: variant,
    });
    alert(`Clicked on Variant ${variant}! Opening video...`);
  };

  if (!variant) {
    return (
      <div className='aspect-video w-full max-w-2xl animate-pulse rounded-xl bg-slate-700'></div>
    );
  }

  return (
    <Card
      onClick={handleClick}
      className='w-full max-w-2xl mx-auto overflow-hidden rounded-xl shadow-lg transition-transform duration-200 ease-in-out hover:scale-[1.02] hover:shadow-2xl cursor-pointer border-2'
    >
      <CardContent className='p-0 relative'>
        <AdvancedImage cldImg={variants[variant]} className='w-full' />
        <Badge variant='secondary' className='absolute top-3 right-3'>
          Variant: {variant}
        </Badge>
      </CardContent>
    </Card>
  );
};
