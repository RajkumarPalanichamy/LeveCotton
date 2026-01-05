'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import ProductPageClient from '@/components/ProductPageClient';
import { useProducts } from '@/hooks/useProducts';

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { products, loading } = useProducts();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find(p => p.id === params.id);
      setProduct(foundProduct);
    }
  }, [products, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductPageClient product={product} />
    </div>
  );
}