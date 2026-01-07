'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '../../../components/ProductCard';
import { WhatsAppButton } from '../../../components/WhatsAppButton';

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

interface ApiResponse {
  products: Product[];
  total: number;
  collections: string[];
  categories: {
    'new-arrivals': number;
    'best-sellers': number;
    'collections': number;
    'sale': number;
  };
}

export default function EnhancedCollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedCollection]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = selectedCollection 
        ? `/api/products?collection=${encodeURIComponent(selectedCollection)}`
        : '/api/products?limit=70';
      
      const response = await fetch(url);
      const data: ApiResponse = await response.json();
      
      setProducts(data.products);
      setCollections(data.collections || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const collectionCounts = collections.reduce((acc, collection) => {
    acc[collection] = products.filter(p => p.collection === collection).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Our Collections
          </h1>
          <p className="text-gray-600">
            Explore our curated collections of premium sarees with unique product codes
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Collections Filter */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Collections</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCollection('')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCollection === '' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>All Collections</span>
                    <span className="text-sm text-gray-500">
                      {products.length}
                    </span>
                  </div>
                </button>
                
                {collections.map((collection) => (
                  <button
                    key={collection}
                    onClick={() => setSelectedCollection(collection)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCollection === collection 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{collection}</span>
                      <span className="text-xs text-gray-500">
                        {collectionCounts[collection] || 0}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-lg mb-4">Product Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total Products:</span>
                  <span className="font-medium">{products.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>New Arrivals:</span>
                  <span className="font-medium">20</span>
                </div>
                <div className="flex justify-between">
                  <span>Best Sellers:</span>
                  <span className="font-medium">20</span>
                </div>
                <div className="flex justify-between">
                  <span>Collections:</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex justify-between">
                  <span>Sale Items:</span>
                  <span className="font-medium">15</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Collection Header */}
            {selectedCollection && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedCollection}
                </h2>
                <p className="text-gray-600">
                  {collectionCounts[selectedCollection]} products in this collection
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Products Grid */}
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600">
                      {selectedCollection 
                        ? `No products available in ${selectedCollection}` 
                        : 'No products available'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}