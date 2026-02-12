'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { Navbar } from '@/components/Navbar';
import { RazorpayCheckout } from '@/components/RazorpayCheckout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, CreditCard, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, sessionId } = useCart();
  const { products } = useProducts();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetch('/api/products?limit=70')
      .then(res => res.json())
      .then(data => setAllProducts(data.products || []));
  }, []);

  const cartItems = cart.map(item => {
    const product = allProducts.find((p: any) => p.id === item.productId) || products.find((p: any) => p.id === item.productId);
    return { ...item, product };
  });

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleWhatsAppCheckout = () => {
    let message = `🛍️ *NEW ORDER - LEVE COTTONS* 🛍️\n\n`;

    if (customerInfo.name) {
      message += `👤 *Customer Details:*\n`;
      message += `Name: ${customerInfo.name}\n`;
      message += `Phone: ${customerInfo.phone}\n`;
      message += `Address: ${customerInfo.address}\n\n`;
    }

    cartItems.forEach((item, index) => {
      if (item.product) {
        message += `📦 *Product ${index + 1}:*\n`;
        message += `Code: ${item.product.productCode || `LC-${item.productId}`}\n`;
        message += `Name: ${item.product.name}\n`;
        message += `Price: ₹${item.product.price.toLocaleString('en-IN')}\n`;
        message += `Quantity: ${item.quantity}\n`;
        message += `Subtotal: ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}\n\n`;
      }
    });

    message += `💳 *Total Amount: ₹${total.toLocaleString('en-IN')}*\n\n`;
    message += `📅 *Order Date: ${new Date().toLocaleDateString('en-IN')}*\n`;
    message += `🕐 *Order Time: ${new Date().toLocaleTimeString('en-IN')}*\n\n`;
    message += `Please confirm this order and share delivery details.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919345868005?text=${encodedMessage}`;

    clearCart();
    window.open(whatsappUrl, '_blank');
  };

  const handlePaymentSuccess = (orderId: string) => {
    setPaymentSuccess(orderId);
    clearCart();
    setShowCheckoutForm(false);
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
  };

  // Payment success screen
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-white page-container">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif mb-4 text-green-600">Payment Successful!</h1>
            <p className="text-gray-600 mb-2">Thank you for your order.</p>
            <p className="text-sm text-gray-500 mb-8">Order ID: <span className="font-mono font-bold">{paymentSuccess}</span></p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white page-container">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-serif mb-4">Your cart is empty</h1>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white page-container">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={`${item.productId}-${item.variantId}`}>
                <CardContent className="p-6 flex gap-6">
                  {item.product && (
                    <>
                      <img
                        src={item.product.image || item.product.image_url}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.product.name}</h3>
                        <p className="text-xs text-gray-500 font-mono mb-1">
                          {item.product.productCode || item.product.product_code}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Size: {item.variantId || 'M'}
                        </p>
                        <p className="font-serif">₹{item.product.price.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-serif mb-4">Order Summary</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-serif pt-4 border-t">
                  <span>Total</span>
                  <span className="font-bold">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Form */}
              {!showCheckoutForm ? (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowCheckoutForm(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <CreditCard className="w-5 h-5" />
                    Proceed to Checkout
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Customer Details</h3>

                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <textarea
                    placeholder="Shipping Address *"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    required
                  />

                  <div className="space-y-3 pt-2">
                    {/* Razorpay Pay Online */}
                    {customerInfo.name && customerInfo.phone && customerInfo.address ? (
                      <RazorpayCheckout
                        amount={total}
                        customerInfo={customerInfo}
                        sessionId={sessionId}
                        items={cartItems
                          .filter(item => item.product)
                          .map(item => ({
                            productId: item.productId,
                            productCode: item.product?.productCode || item.product?.product_code,
                            productName: item.product?.name || '',
                            price: item.product?.price || 0,
                            quantity: item.quantity,
                          }))}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
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

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 border-t"></div>
                      <span className="text-sm text-gray-400">or</span>
                      <div className="flex-1 border-t"></div>
                    </div>

                    {/* WhatsApp Order */}
                    <button
                      onClick={handleWhatsAppCheckout}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Order via WhatsApp
                    </button>

                    <button
                      onClick={() => setShowCheckoutForm(false)}
                      className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm"
                    >
                      ← Back to summary
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}