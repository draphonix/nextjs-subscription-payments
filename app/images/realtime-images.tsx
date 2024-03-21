'use client';

import { use, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Image = {
  id: string;
  data: string;
  created_at: string;
  modified_data: string;
};
const supabase = createClient();
export default function RealtimeImages({
  serverImages
}: {
  serverImages: Image[];
}) {
  const [images, setImages] = useState(serverImages);
  useEffect(() => {
    const channel = supabase
      .channel('realtime images')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'images'
        },
        (payload) => {
          setImages([...images, payload.new as Image]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, images, setImages]);
  return <pre>{JSON.stringify(images)}</pre>;
}
