import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const baseUrl = 'https://levecottons.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch all products from Supabase
    const { data: products } = await supabase
        .from('products')
        .select('id, createdAt');

    const productUrls = (products || []).map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(product.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const routes = [
        '',
        '/new-arrivals',
        '/best-sellers',
        '/collections',
        '/sale',
        '/wholesale',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.9,
    }));

    return [...routes, ...productUrls];
}
