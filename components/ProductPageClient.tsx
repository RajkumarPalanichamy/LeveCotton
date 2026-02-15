'use client';

import { useState } from 'react';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { RazorpayCheckout } from '@/components/RazorpayCheckout';

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
  color?: string;
  fabric?: string;
  productCode?: string;
  collection?: string;
  colors?: string[];
  sizes?: string[];
}

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [buyNowSuccess, setBuyNowSuccess] = useState<string | null>(null);
  const [buyNowInfo, setBuyNowInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: 'default',
      quantity: 1
    } as any);
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
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.inStock
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() => setShowBuyNow(true)}
                  disabled={!product.inStock}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <CreditCard className="w-6 h-6" />
                  Buy Now
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <ShoppingBag className="w-5 h-5" />
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
                  <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Now Modal */}
      {showBuyNow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            {buyNowSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-2">Thank you for your order.</p>
                <p className="text-sm text-gray-500 mb-6">Order ID: <span className="font-mono font-bold">{buyNowSuccess}</span></p>
                <button
                  onClick={() => { setBuyNowSuccess(null); setShowBuyNow(false); }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl font-bold text-lg"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Buy Now</h3>
                  <button onClick={() => setShowBuyNow(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                {/* Product summary */}
                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{product.category?.replace('-', ' ')}</p>
                    <p className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={buyNowInfo.name}
                    onChange={(e) => setBuyNowInfo({ ...buyNowInfo, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={buyNowInfo.email}
                    onChange={(e) => setBuyNowInfo({ ...buyNowInfo, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={buyNowInfo.phone}
                    onChange={(e) => setBuyNowInfo({ ...buyNowInfo, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    placeholder="Shipping Address *"
                    value={buyNowInfo.address}
                    onChange={(e) => setBuyNowInfo({ ...buyNowInfo, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                </div>

                <div className="mt-6 space-y-3">
                  {buyNowInfo.name && buyNowInfo.phone && buyNowInfo.address ? (
                    <RazorpayCheckout
                      amount={product.price}
                      customerInfo={buyNowInfo}
                      items={[{
                        productId: product.id,
                        productCode: (product as any).productCode || '',
                        productName: product.name,
                        price: product.price,
                        quantity: 1,
                      }]}
                      onSuccess={(orderId) => setBuyNowSuccess(orderId)}
                      onError={(error) => alert(`Payment failed: ${error}`)}
                    />
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-4 px-8 rounded-2xl font-bold text-lg cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      <CreditCard className="w-5 h-5" />
                      Fill details to pay online
                    </button>
                  )}
                  <button
                    onClick={() => setShowBuyNow(false)}
                    className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}