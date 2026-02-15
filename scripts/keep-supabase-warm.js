const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function pingDatabase() {
    console.log(`[${new Date().toISOString()}] 🕒 Pinging Supabase to keep it awake...`);

    try {
        const { data, error } = await supabase
            .from('products')
            .select('id')
            .limit(1);

        if (error) throw error;

        console.log(`[${new Date().toISOString()}] ✅ Ping successful. Supabase is active.`);
    } catch (err) {
        console.error(`[${new Date().toISOString()}] ❌ Ping failed:`, err.message);
    }
}

// Run immediately on start
pingDatabase();

// Run every 24 hours (86400000 ms)
// This ensures that even with zero traffic, Supabase sees activity daily.
setInterval(pingDatabase, 86400000);
