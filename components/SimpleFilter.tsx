'use client';

import { useState } from 'react';

interface SimpleFilterProps {
  products: any[];
  onFilteredProducts: (products: any[]) => void;
}

export function SimpleFilter({ products, onFilteredProducts }: SimpleFilterProps) {
  const [sortBy, setSortBy] = useState('name');

  const handleSort = (value: string) => {
    setSortBy(value);
    let sorted = [...products];
    
    switch (value) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    onFilteredProducts(sorted);
  };

  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="text-sm text-gray-600">
        Showing {products.length} products
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="p-2 border rounded-lg text-sm bg-white"
        >
          <option value="name">Name A-Z</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}