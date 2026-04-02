'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { ProductFilters } from '@/components/ProductFilters';
import Link from 'next/link';

interface Product {
  id: string;
  productCode: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  description: string;
  category: string;
  collection: string;
  color: string;
  fabric: string;
  inStock: boolean;
}

export default function Collections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ colors: [], priceRange: '', fabrics: [] });
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const colors = ['Red', 'Blue', 'Green', 'Pink', 'Black', 'White', 'Yellow', 'Purple', 'Maroon', 'Teal'];
  const fabrics = ['Cotton', 'Silk', 'Georgette', 'Rayon'];
  const priceRanges = [
    { label: 'Under ₹15,000', value: '0-15000' },
    { label: '₹15,000 - ₹20,000', value: '15000-20000' },
    { label: '₹20,000 - ₹30,000', value: '20000-30000' },
    { label: 'Above ₹30,000', value: '30000+' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=70');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      variantId: 'default',
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    setAddedProduct(product);
    setShowCartPopup(true);
    setTimeout(() => setShowCartPopup(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Collections</h1>
            <p className="text-gray-600">Loading all 70 products...</p>
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
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">All Collections</h1>
          <p className="text-gray-600">All 70 products with unique codes</p>
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
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center gap-2 shadow-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 text-sm font-medium"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 font-mono mb-1">
                  {product.productCode}
                </div>
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
      
      {/* Enhanced Cart Popup */}
      {showCartPopup && addedProduct && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-2xl animate-bounce max-w-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Added to Cart!</p>
              <p className="text-xs text-green-100 truncate">{addedProduct.name}</p>
              <p className="text-xs text-green-100">₹{addedProduct.price.toLocaleString()}</p>
            </div>
            <button 
              onClick={() => setShowCartPopup(false)}
              className="text-white/80 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <Link href="/cart" className="flex-1 bg-white/20 hover:bg-white/30 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors">
              View Cart
            </Link>
            <button 
              onClick={() => setShowCartPopup(false)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}