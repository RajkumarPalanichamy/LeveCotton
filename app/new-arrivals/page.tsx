'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useProducts } from '@/hooks/useProducts';
import { Navbar } from '@/components/Navbar';
import { ProductFilters } from '@/components/ProductFilters';
import Link from 'next/link';

export default function NewArrivals() {
  const { products, loading, error } = useProducts('new-arrivals');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ colors: [], priceRange: '', fabrics: [] });
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const colors = ['Red', 'Blue', 'Green', 'Pink', 'Black', 'White', 'Yellow', 'Purple'];
  const fabrics = ['Cotton', 'Silk', 'Georgette', 'Rayon'];
  const priceRanges = [
    { label: 'Under ₹5,000', value: '0-5000' },
    { label: '₹5,000 - ₹10,000', value: '5000-10000' },
    { label: '₹10,000 - ₹20,000', value: '10000-20000' },
    { label: 'Above ₹20,000', value: '20000+' }
  ];

  useEffect(() => {
    let filtered = products;
    
    if (filters.colors.length > 0) {
      filtered = filtered.filter(p => filters.colors.includes(p.color));
    }
    
    if (filters.fabrics.length > 0) {
      filtered = filtered.filter(p => filters.fabrics.includes(p.fabric));
    }
    
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(v => v === '+' ? Infinity : parseInt(v));
      filtered = filtered.filter(p => p.price >= min && (max === Infinity || p.price <= max));
    }
    
    setFilteredProducts(filtered);
  }, [filters, products]);

  console.log('New Arrivals page - Products:', products.length, loading, error);

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      variantId: 'default',
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  const handleToggleWishlist = (product: any) => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      images: [product.image],
      category: product.category
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">New Arrivals</h1>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">New Arrivals</h1>
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const displayProducts = filteredProducts.length > 0 || filters.colors.length > 0 || filters.fabrics.length > 0 || filters.priceRange ? filteredProducts : products;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">New Arrivals</h1>
          <p className="text-gray-600">Discover our latest collection</p>
        </div>

        <div className="flex gap-8">
          <ProductFilters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
            colors={colors}
            priceRanges={priceRanges}
            fabrics={fabrics}
          />
          
          <div className="flex-1">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <Link href={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  />
                </Link>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleToggleWishlist(product)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} />
                  </button>
                </div>
              </div>
              <div className="text-center">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-gray-700 cursor-pointer mb-2">{product.name}</h3>
                </Link>
                <p className="text-lg font-serif text-gray-900">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}