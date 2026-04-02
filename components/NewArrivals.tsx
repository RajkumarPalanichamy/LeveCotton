'use client';

import { useState } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import Link from 'next/link';

interface ProductCardProps {
  product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: 'default',
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  return (
    <div className="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72">
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-xl group cursor-pointer">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 sm:h-72 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center gap-2 shadow-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 text-sm font-medium"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
      <div className="mt-3 sm:mt-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 hover:text-gray-700 cursor-pointer text-sm sm:text-base line-clamp-2">{product.name}</h3>
        </Link>
        <p className="text-base sm:text-lg font-serif text-gray-900 mt-1">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
};

export const NewArrivals = () => {
  const { products, loading, error } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const displayProducts = products;
  const itemsPerView = 4;
  const maxIndex = Math.max(0, displayProducts.length - itemsPerView);

  if (loading) {
    console.log('Products loading...');
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.log('Products error:', error);
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-red-600 mb-6">Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  console.log('Products loaded:', products.length, products);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-900 mb-2 sm:mb-4">New Arrivals</h2>
          <p className="text-gray-600 text-sm sm:text-base">Discover our latest collection</p>
        </div>

        {displayProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No products available</p>
          </div>
        ) : (
          <>
            {/* Mobile Horizontal Scroll */}
            <div className="md:hidden">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                  {displayProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <p className="text-xs text-gray-500">← Swipe to see more →</p>
              </div>
            </div>

            {/* Desktop Slider */}
            <div className="hidden md:block relative">
              <div className="overflow-hidden">
                <div 
                  className="flex gap-6 transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * (288 + 24)}px)` }}
                >
                  {displayProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
              
              {currentIndex > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
              )}
              
              {currentIndex < maxIndex && (
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};