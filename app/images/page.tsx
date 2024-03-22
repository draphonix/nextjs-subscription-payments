import { createClient } from '@/utils/supabase/server';
import RealtimeImages from './realtime-images';
import { redirect } from 'next/navigation';
export const revalidate = 0;

export default async function Images() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/signin');
  }
  const { data } = await supabase.from('images').select('*');
  return <RealtimeImages serverImages={data ?? []} />;
}
