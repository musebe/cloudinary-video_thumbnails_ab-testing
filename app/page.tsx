// app/page.tsx
import { ABTestThumbnail } from '@/components/ABTestThumbnail';

export default function HomePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50'>
      <div className='container mx-auto text-center'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-4'>
          A/B Testing Video Thumbnails
        </h1>
        <p className='mb-8 text-lg text-gray-600'>
          Refresh the page to see a different thumbnail variant.
        </p>

        {/* --- Use the correct public ID including the folder --- */}
        <ABTestThumbnail videoPublicId='samples/elephants' />
      </div>
    </main>
  );
}
