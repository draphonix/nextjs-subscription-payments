import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import PlaygroundUI from './playground-ui';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Playground() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  
  // Redirect to signin if not authenticated
  if (!user) {
    return redirect('/signin');
  }
  
  // Fetch images for history
  const { data } = await supabase.from('images').select('*');
  
  return <PlaygroundUI serverImages={data ?? []} />;
} 