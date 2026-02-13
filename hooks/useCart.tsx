'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { CartItem } from '@/types';

// Generate or retrieve a persistent session ID for guest users
function getSessionId(): string {
  if (typeof window === 'undefined') return 'guest';
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  updateQuantity: (productId: string, variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string, variantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  sessionId: string;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const sessionId = typeof window !== 'undefined' ? getSessionId() : 'guest';
  const hasFetched = useRef(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setCart(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Fallback to localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch { }
      }
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchCart();
    }
  }, [fetchCart]);

  const addToCart = useCallback(async (item: CartItem) => {
    console.log('Adding to cart:', item);

    // Optimistic update
    setCart(prev => {
      const existing = prev.find(
        c => c.productId === item.productId && c.variantId === item.variantId
      );
      let newCart;
      if (existing) {
        newCart = prev.map(c =>
          c.productId === item.productId && c.variantId === item.variantId
            ? { ...c, quantity: c.quantity + item.quantity }
            : c
        );
      } else {
        newCart = [...prev, item];
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });

    // Persist to server
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productId: item.productId,
          variantId: item.variantId || 'default',
          quantity: item.quantity,
        }),
      });
    } catch (error) {
      console.error('Failed to save cart to server:', error);
    }
  }, [sessionId]);

  const updateQuantity = useCallback(async (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    const newCart = cart.map(c =>
      c.productId === productId && c.variantId === variantId
        ? { ...c, quantity }
        : c
    );
    setCart(newCart);

    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productId,
          variantId: variantId || 'default',
          quantity,
        }),
      });
    } catch (error) {
      console.error('Failed to update cart:', error);
    }

    localStorage.setItem('cart', JSON.stringify(newCart));
  }, [sessionId, cart]);

  const removeFromCart = useCallback(async (productId: string, variantId: string) => {
    const newCart = cart.filter(c => !(c.productId === productId && c.variantId === variantId));
    setCart(newCart);

    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productId,
          variantId: variantId || 'default',
        }),
      });
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }

    localStorage.setItem('cart', JSON.stringify(newCart));
  }, [sessionId, cart]);

  const clearCart = useCallback(async () => {
    setCart([]);

    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, clearAll: true }),
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }

    localStorage.removeItem('cart');
  }, [sessionId]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, loading, sessionId, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}