'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CategoryNavProps {
  currentCategory?: string;
  onCategoryChange?: (category: string) => void;
}

interface CategoryData {
  categories: {
    'new-arrivals': number;
    'best-sellers': number;
    'collections': number;
    'sale': number;
  };
  collections: string[];
}

export function CategoryNav({ currentCategory, onCategoryChange }: CategoryNavProps) {
  const [categoryData, setCategoryData] = useState<CategoryData>({
    categories: {
      'new-arrivals': 0,
      'best-sellers': 0,
      'collections': 0,
      'sale': 0
    },
    collections: []
  });

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setCategoryData({
        categories: data.categories || {
          'new-arrivals': 20,
          'best-sellers': 20,
          'collections': 15,
          'sale': 15
        },
        collections: data.collections || []
      });
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  const categories = [
    {
      id: 'new-arrivals',
      name: 'New Arrivals',
      description: 'Latest saree designs',
      count: categoryData.categories['new-arrivals'],
      color: 'bg-blue-500',
      href: '/new-arrivals'
    },
    {
      id: 'best-sellers',
      name: 'Best Sellers',
      description: 'Most popular sarees',
      count: categoryData.categories['best-sellers'],
      color: 'bg-green-500',
      href: '/best-sellers'
    },
    {
      id: 'collections',
      name: 'Collections',
      description: 'Curated collections',
      count: categoryData.categories['collections'],
      color: 'bg-purple-500',
      href: '/collections'
    },
    {
      id: 'sale',
      name: 'Sale',
      description: 'Special offers',
      count: categoryData.categories['sale'],
      color: 'bg-red-500',
      href: '/sale'
    }
  ];

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Categories */}
        <div className="flex flex-wrap gap-1 py-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:shadow-md ${
                currentCategory === category.id
                  ? `${category.color} text-white shadow-md`
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => onCategoryChange?.(category.id)}
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">{category.name}</span>
                <span className={`text-xs ${
                  currentCategory === category.id ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {category.description}
                </span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                currentCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {category.count}
              </div>
            </Link>
          ))}
        </div>

        {/* Collections Dropdown */}
        <div className="pb-4">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              <span>Browse Collections</span>
              <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {categoryData.collections.map((collection) => (
                <Link
                  key={collection}
                  href={`/collections/enhanced?collection=${encodeURIComponent(collection)}`}
                  className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 text-center"
                >
                  {collection}
                </Link>
              ))}
            </div>
          </details>
        </div>

        {/* Product Code Info */}
        <div className="pb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Product Codes & WhatsApp Orders
                </h4>
                <p className="text-xs text-blue-700">
                  Each product has a unique code (LC-XX-XXX). Use the WhatsApp button on any product to inquire or place orders with the product code included automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}