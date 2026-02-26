import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; `  `

// Browser client (public, uses anon key with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: 'levecotton' }
});

// Server client (for API routes, bypasses RLS with service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    db: { schema: 'levecotton' }
});
