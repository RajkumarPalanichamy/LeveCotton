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
    const message = `Hi LEVE COTTONS! I want to buy this product:\n\n*${product.name}*\nPrice: ₹${product.price.toLocaleString('en-IN')}\n${selectedSize ? `Size: ${selectedSize}` : ''}\n${selectedColor ? `Color: ${selectedColor}` : ''}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919363499905?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-serif text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</p>
              {product.originalPrice && (
                <p className="text-lg text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg text-sm ${
                      selectedColor === color
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg text-sm ${
                      selectedSize === size
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Buy Now
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              
              <button
                onClick={handleToggleWishlist}
                className={`border py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  isInWishlist(product.id)
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
                {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="border-t pt-6">
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Category:</span> {product.category}</p>
              <p><span className="font-medium">Stock:</span> {product.inStock ? 'In Stock' : 'Out of Stock'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}