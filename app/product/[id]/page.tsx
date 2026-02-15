import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { Navbar } from '@/components/Navbar';
import ProductPageClient from '@/components/ProductPageClient';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';

interface ProductPageProps {
  params: { id: string };
}

async function getProduct(id: string) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  return product;
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      url: `https://levecottons.com/product/${product.id}`,
      images: [
        {
          url: product.images?.[0] || product.image || '/og-image.jpg',
          width: 800,
          height: 600,
          alt: product.name,
        },
        ...previousImages,
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description.substring(0, 160),
      images: [product.images?.[0] || product.image || '/og-image.jpg'],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [product.image],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Leve Cottons',
    },
    offers: {
      '@type': 'Offer',
      url: `https://levecottons.com/product/${product.id}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={jsonLd} />
      <Navbar />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      }>
        <ProductPageClient product={product} />
      </Suspense>
    </div>
  );
}