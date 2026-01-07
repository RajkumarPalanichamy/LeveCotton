'use client';

import Image from 'next/image';
import { WhatsAppButton } from './WhatsAppButton';
import { useState } from 'react';

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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    quantity: 1
  });

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOrderForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            {product.discount}% OFF
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Code */}
        <div className="text-xs text-gray-500 font-mono mb-1">
          Code: {product.productCode}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Collection */}
        <div className="text-sm text-blue-600 mb-2">
          {product.collection}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium">Color:</span> {product.color}
          </div>
          <div>
            <span className="font-medium">Fabric:</span> {product.fabric}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowOrderForm(true)}
            disabled={!product.inStock}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
          >
            {product.inStock ? 'Order Now' : 'Out of Stock'}
          </button>
          
          <div className="relative">
            <WhatsAppButton 
              product={product}
              type="inquiry"
            />
          </div>
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Place Order</h3>
            
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  required
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={customerInfo.quantity}
                  onChange={(e) => setCustomerInfo({...customerInfo, quantity: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                <WhatsAppButton 
                  product={product}
                  customerInfo={customerInfo}
                  type="order"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}