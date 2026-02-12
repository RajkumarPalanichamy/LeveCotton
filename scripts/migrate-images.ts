// Migrate product images from /public/products/ to Supabase Storage
// Run with: npx tsx --tsconfig scripts/tsconfig.json scripts/migrate-images.ts

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET = 'product-images';
const PRODUCTS_DIR = join(process.cwd(), 'public', 'products');

// Map file extension to MIME type
function getMimeType(ext: string): string {
    const mimeMap: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
    };
    return mimeMap[ext.toLowerCase()] || 'image/jpeg';
}

async function migrateImages() {
    console.log('🖼️  Starting product image migration...\n');

    // 1. Read all image files from /public/products/
    const files = readdirSync(PRODUCTS_DIR).filter(f => {
        const ext = extname(f).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });

    console.log(`📦 Found ${files.length} images to upload\n`);

    let uploaded = 0;
    let skipped = 0;
    let failed = 0;
    const urlMap: Record<string, string> = {}; // filename -> public URL

    for (const file of files) {
        const filePath = join(PRODUCTS_DIR, file);
        const ext = extname(file);
        const mimeType = getMimeType(ext);

        try {
            const buffer = readFileSync(filePath);

            // Upload to Supabase Storage (upsert to handle re-runs)
            const { error: uploadError } = await supabase.storage
                .from(BUCKET)
                .upload(file, buffer, {
                    contentType: mimeType,
                    upsert: true,
                });

            if (uploadError) {
                console.error(`  ❌ Failed to upload ${file}: ${uploadError.message}`);
                failed++;
                continue;
            }

            // Get public URL
            const { data: publicUrlData } = supabase.storage
                .from(BUCKET)
                .getPublicUrl(file);

            urlMap[file] = publicUrlData.publicUrl;
            uploaded++;

            if (uploaded % 10 === 0) {
                console.log(`  📤 Uploaded ${uploaded}/${files.length} images...`);
            }
        } catch (err) {
            console.error(`  ❌ Error processing ${file}:`, err);
            failed++;
        }
    }

    console.log(`\n✅ Upload complete: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed\n`);

    // 2. Update product records in database
    console.log('📝 Updating product image URLs in database...\n');

    // Fetch all products
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, image_url');

    if (fetchError || !products) {
        console.error('❌ Failed to fetch products:', fetchError?.message);
        process.exit(1);
    }

    let updated = 0;
    for (const product of products) {
        // Extract the filename from the current image_url (e.g., "/products/1.jpg" -> "1.jpg")
        const currentUrl = product.image_url || '';
        const match = currentUrl.match(/\/products\/(.+)$/);
        if (!match) {
            console.log(`  ⏭️  Skipping product ${product.id} — image_url doesn't match /products/ pattern: ${currentUrl}`);
            continue;
        }

        const filename = match[1];
        const newUrl = urlMap[filename];

        if (!newUrl) {
            console.log(`  ⚠️  No uploaded file found for ${filename} (product ${product.id})`);
            continue;
        }

        const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: newUrl })
            .eq('id', product.id);

        if (updateError) {
            console.error(`  ❌ Failed to update product ${product.id}: ${updateError.message}`);
        } else {
            updated++;
        }
    }

    console.log(`\n🎉 Migration complete!`);
    console.log(`   📤 ${uploaded} images uploaded to Supabase Storage`);
    console.log(`   📝 ${updated} product records updated with new URLs`);
}

migrateImages().catch(console.error);
