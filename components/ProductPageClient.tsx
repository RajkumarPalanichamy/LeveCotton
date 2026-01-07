'use client';

import { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  category: string;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
}

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

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

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      images: [product.image],
      category: product.category
    });
  };

  const handleBuyNow = () => {
    const message = `Hi LEVE COTTONS! I want to buy this product:\n\n*${product.name}*\nPrice: ₹${product.price.toLocaleString('en-IN')}\n${selectedSize ? `Size: ${selectedSize}` : ''}\n${selectedColor ? `Color: ${selectedColor}` : ''}\n\nProduct Image: ${window.location.origin}${product.image}\n\nPlease confirm availability and delivery details.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919345868005?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Home</span>
            <span>/</span>
            <span className="capitalize">{product.category?.replace('-', ' ')}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl bg-white p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute top-6 right-6">
                <button
                  onClick={handleToggleWishlist}
                  className={`w-12 h-12 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 flex items-center justify-center ${
                    isInWishlist(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-xl shadow-md bg-white p-2">
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="mb-6">
                <h1 className="text-4xl font-serif text-gray-900 mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                  {product.originalPrice && (
                    <p className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
                    {product.category?.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Colors */}
              {product.color && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-xl text-purple-800 font-medium">
                      {product.color}
                    </span>
                  </div>
                </div>
              )}

              {/* Fabric */}
              {product.fabric && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Fabric</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 rounded-xl text-pink-800 font-medium">
                      {product.fabric}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  Buy Now via WhatsApp
                </button>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <ShoppingBag className="w-6 h-6" />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Product ID:</span>
                  <span className="font-medium text-gray-900">{product.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900 capitalize">{product.category?.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Availability:</span>
                  <span className={`font-medium ${
                    product.inStock ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}