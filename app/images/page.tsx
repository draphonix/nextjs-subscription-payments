import { createClient } from '@/utils/supabase/server';
import RealtimeImages from './realtime-images';

export const revalidate = 0;
const supabase = createClient();
export default async function Images() {
  const { data } = await supabase.from('images').select("*");
  return <RealtimeImages serverImages={data ?? []} />;
}
