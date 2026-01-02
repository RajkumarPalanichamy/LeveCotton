import { Navbar } from '@/components/Navbar';
import { products } from '@/lib/data';
import ProductPageClient from '@/components/ProductPageClient';

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find(p => p.id === params.id);

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