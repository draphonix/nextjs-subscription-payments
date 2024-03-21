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
  const { data: image, error } = await supabase.from('images')
    .select()
    .match({ id })
    .single();

    console.log("=============== ", image, error);
  if (!image) {
    notFound();
  }

  return <RealtimeImage serverImage={image} />;
}
