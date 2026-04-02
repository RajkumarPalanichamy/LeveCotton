'use client';

import { useState } from 'react';
import { CreditCard, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { LazyImage } from './LazyImage';
import { RazorpayCheckout } from './RazorpayCheckout';

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
  const { addToCart } = useCart();
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        <LazyImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold z-10">
            {product.discount}% OFF
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
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

        <div className="space-y-2">
          <button
            onClick={() => setShowBuyNow(true)}
            disabled={!product.inStock}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <CreditCard className="w-4 h-4" />
            {product.inStock ? 'Buy Now' : 'Out of Stock'}
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 border-2 ${addedToCart
              ? 'bg-green-50 border-green-500 text-green-600'
              : 'bg-white border-purple-100 text-purple-600 hover:bg-purple-50 hover:border-purple-200'
              }`}
          >
            {addedToCart ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>



      {/* Buy Now Modal */}
      {showBuyNow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            {buyNowSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                <p className="text-sm text-gray-500 mb-4">Order ID: <span className="font-mono">{buyNowSuccess}</span></p>
                <button
                  onClick={() => { setBuyNowSuccess(null); setShowBuyNow(false); }}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-xl font-medium"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Buy Now</h3>
                  <button onClick={() => setShowBuyNow(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                </div>

                {/* Product summary */}
                <div className="flex gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <p className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{product.productCode}</p>
                    <p className="font-bold text-purple-600">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={buyNowInfo.name}
                    onChange={(e) => setBuyNowInfo({ ...buyNowInfo, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={buyNowInfo.email}
                    onChange={(e) => setBuyNowInfo({ ...buyNowInfo, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={buyNowInfo.phone}
                    onChange={(e) => setBuyNowInfo({ ...buyNowInfo, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    placeholder="Shipping Address *"
                    value={buyNowInfo.address}
                    onChange={(e) => setBuyNowInfo({ ...buyNowInfo, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={2}
                  />
                </div>

                <div className="mt-4 space-y-2">
                  {buyNowInfo.name && buyNowInfo.phone && buyNowInfo.address ? (
                    <RazorpayCheckout
                      amount={product.price}
                      customerInfo={buyNowInfo}
                      items={[{
                        productId: product.id,
                        productCode: product.productCode,
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
                      className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-xl font-bold cursor-not-allowed text-sm"
                    >
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