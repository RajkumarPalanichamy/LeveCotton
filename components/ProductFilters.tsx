'use client';

import { Filter } from 'lucide-react';

interface ProductFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: {
    colors: string[];
    priceRange: string;
    fabrics: string[];
  };
  setFilters: (filters: any) => void;
  colors: string[];
  priceRanges: { label: string; value: string }[];
  fabrics: string[];
}

export const ProductFilters = ({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  colors,
  priceRanges,
  fabrics
}: ProductFiltersProps) => {
  const toggleFilter = (type: 'colors' | 'fabrics', value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item: string) => item !== value)
        : [...prev[type], value]
    }));
  };

  const clearFilters = () => {
    setFilters({ colors: [], priceRange: '', fabrics: [] });
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        Filters
      </button>

      {/* Filters Sidebar */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 mb-6 md:mb-0`}>
        <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Filters</h3>
            <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">
              Clear All
            </button>
          </div>

          {/* Color Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Color</h4>
            <div className="space-y-2">
              {colors.map(color => (
                <label key={color} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color)}
                    onChange={() => toggleFilter('colors', color)}
                    className="mr-2"
                  />
                  <span className="text-sm">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Price Range</h4>
            <div className="space-y-2">
              {priceRanges.map(range => (
                <label key={range.value} className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === range.value}
                    onChange={() => setFilters((prev: any) => ({ ...prev, priceRange: range.value }))}
                    className="mr-2"
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fabric Filter */}
          <div>
            <h4 className="font-medium mb-3">Fabric</h4>
            <div className="space-y-2">
              {fabrics.map(fabric => (
                <label key={fabric} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.fabrics.includes(fabric)}
                    onChange={() => toggleFilter('fabrics', fabric)}
                    className="mr-2"
                  />
                  <span className="text-sm">{fabric}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};