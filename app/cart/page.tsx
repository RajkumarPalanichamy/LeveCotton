'use client';

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

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  });

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleWhatsAppCheckout = () => {
    let message = `Hi LEVE COTTONS! I want to place an order:

`;
    
    cartItems.forEach((item, index) => {
      if (item.product) {
        message += `${index + 1}. *${item.product.name}*
`;
        message += `   Price: ₹${item.product.price.toLocaleString('en-IN')}
`;
        message += `   Quantity: ${item.quantity}
`;
        message += `   Subtotal: ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}

`;
      }
    });

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919363499905?text=${encodedMessage}`;
    
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
                className="w-full" size="lg"
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