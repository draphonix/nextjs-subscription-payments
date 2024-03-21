'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Image = {
  id: string;
  data: string;
  created_at: string;
  modified_data: string;
};
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
  return <pre>
    {JSON.stringify(image)}
    {/* Let create a div that display the binary data as image */}
    <div>
      <img src={`data:image/png;base64,${image.data}`} />
    </div>
    </pre>;
}
