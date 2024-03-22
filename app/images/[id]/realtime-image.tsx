'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Database, Tables, TablesInsert } from 'types_db';

type Image = Tables<'images'>;

const supabase = createClient();
export default function RealtimeImage({ serverImage }: { serverImage: Image }) {
  const [image, setImage] = useState(serverImage);
  useEffect(() => {
    const channel = supabase
      .channel('realtime image')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'images',
          filter: `id=eq.${image.id}`
        },
        (payload) => {
          setImage(payload.new as Image);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, image, setImage]);
return (
    <pre>
        {JSON.stringify(image)}
        {/* Let create a div that display the binary data as image */}
        <div>
            {image.original_base64 && <img src={image.original_base64} />}
        </div>
    </pre>
);
}
