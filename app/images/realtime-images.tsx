'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Image } from './types';

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
          setImages((currentImages) => [...currentImages, payload.new as Image]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={images} />
    </div>
  );
}
