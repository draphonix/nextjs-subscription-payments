import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import RealtimeImage from './realtime-image';

export const revalidate = 0;

export default async function Image({
  params: { id }
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: image, error } = await supabase
    .from('images')
    .select('*')
    .match({ id })
    .single();

  if (error) {
    console.error('Error fetching image:', error);
    notFound();
  }

  if (!image) {
    notFound();
  }

  // Check if the image is being processed (no upscale_base64 yet)
  const isProcessing = !image.upscale_base64;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {isProcessing && (
        <div className="bg-blue-900 text-white p-4 rounded-lg mb-6">
          <h2 className="text-lg font-bold mb-1">Processing in Progress</h2>
          <p>
            Your image is being processed. The comparison view will automatically update when the upscaled version is ready.
          </p>
        </div>
      )}
      <RealtimeImage serverImage={image} />
    </div>
  );
}
