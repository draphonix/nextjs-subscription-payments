'use client';

import { use, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ImageUploadForm from './upload-image';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Image } from './types';
// type Image = 
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
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={images} />
    </div>
  );
}
