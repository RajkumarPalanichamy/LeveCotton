'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { Navbar } from '@/components/Navbar';
import { ProductFilters } from '@/components/ProductFilters';
import { Pagination } from '@/components/Pagination';
import Link from 'next/link';

const PAGE_SIZE = 24;

export default function NewArrivals() {
  const { products, loading, error } = useProducts('new-arrivals', 1000);
  const { addToCart } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ colors: [], priceRange: '', fabrics: [] });
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1);
  }, [filters, products]);

  console.log('New Arrivals page - Products:', products.length, loading, error);

  const handleAddToCart = (product: any) => {
    if (product.inStock === false) return;
    addToCart({
      productId: product.id,
      variantId: 'default',
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
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
  const totalPages = Math.max(1, Math.ceil(displayProducts.length / PAGE_SIZE));
  const pageProducts = displayProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">New Arrivals</h1>
          <p className="text-gray-600">Discover our latest collection</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
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

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {pageProducts.map((product) => {
            const canBuy = product.inStock !== false;
            return (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <Link href={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  />
                </Link>
                {!canBuy && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/45">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-900 shadow">
                      Sold out
                    </span>
                  </div>
                )}
                <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={!canBuy}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transform transition-all duration-200 text-sm font-medium ${
                      canBuy
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105'
                        : 'cursor-not-allowed bg-gray-400 text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {canBuy ? 'Add to Cart' : 'Sold out'}
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
            );
          })}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-10"
        />
          </div>
        </div>
      </div>
    </div>
  );
}