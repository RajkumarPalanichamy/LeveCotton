// Seed script to migrate products from JSON file to Supabase
// Run with: npx tsx scripts/seed-products.ts

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load .env.local (Next.js convention)
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedProducts() {
    console.log('🌱 Starting product seed...');

    // Load products from JSON file
    const productsPath = join(process.cwd(), 'lib', 'products.json');
    const rawData = readFileSync(productsPath, 'utf8');
    const products = JSON.parse(rawData);

    console.log(`📦 Found ${products.length} products to seed`);

    // Transform to Supabase format
    const supabaseProducts = products.map((p: any) => ({
        id: p.id,
        product_code: p.productCode,
        name: p.name,
        price: p.price,
        original_price: p.originalPrice || null,
        discount: p.discount || null,
        image_url: p.image,
        description: p.description,
        category: p.category,
        collection: p.collection || null,
        color: p.color || null,
        fabric: p.fabric || null,
        in_stock: p.inStock !== false,
    }));

    // Upsert products (insert or update on conflict)
    const { data, error } = await supabase
        .from('products')
        .upsert(supabaseProducts, { onConflict: 'id' });

    if (error) {
        console.error('❌ Seed failed:', error.message);
        console.error('Details:', error);
        process.exit(1);
    }

    console.log(`✅ Successfully seeded ${products.length} products into Supabase!`);

    // Verify count
    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    console.log(`📊 Total products in database: ${count}`);
}

seedProducts().catch(console.error);
