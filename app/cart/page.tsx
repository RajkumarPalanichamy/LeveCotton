'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { products } = useProducts();

  // Fetch all products to get product codes
  const [allProducts, setAllProducts] = useState([]);
  
  useEffect(() => {
    fetch('/api/products?limit=70')
      .then(res => res.json())
      .then(data => setAllProducts(data.products));
  }, []);

  const cartItems = cart.map(item => {
    const product = allProducts.find(p => p.id === item.productId) || products.find(p => p.id === item.productId);
    return { ...item, product };
  });

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleWhatsAppCheckout = () => {
    let message = `🛍️ *NEW ORDER - LEVE COTTONS* 🛍️\n\n`;
    
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
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={`${item.productId}-${item.variantId}`}>
                <CardContent className="p-6 flex gap-6">
                  {item.product && (
                    <>
                      <img
                        src={item.product.image || item.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{item.product.name}</h3>
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
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity + 1)
                            }
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

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-serif mb-4">Order Summary</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-lg font-serif pt-4 border-t">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
              >
                Proceed to Checkout
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}