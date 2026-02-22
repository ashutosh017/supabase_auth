import { Database } from '@/database.types';
import { createClient } from '@supabase/supabase-js'

const createSupabseClient = () => createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

declare global {
    var supabase: ReturnType<typeof createSupabseClient> | undefined
}
const supabase = globalThis.supabase ?? createSupabseClient();
if (process.env.NODE_ENV !== 'production') {
    globalThis.supabase = supabase
}

export default supabase;