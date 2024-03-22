'use client';

import { use, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ImageUploadForm from './upload-image';
import type { Database, Tables, TablesInsert } from 'types_db';

type Image = Tables<'images'>;
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
    <pre>
      {/* Display the images as a table */}
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>created_at</th>
            <th>origin_image</th>
          </tr>
        </thead>
        <tbody>
            {images.map((image) => (
                <tr key={image.id}>
                    <td>{image.id}</td>
                    <td>{image.created_at}</td>
                    <td>
                        {image.original_base64 && <img src={image.original_base64} />}
                    </td>
                </tr>
            ))}
        </tbody>
      </table>
      <ImageUploadForm />
    </pre>
  );
}
