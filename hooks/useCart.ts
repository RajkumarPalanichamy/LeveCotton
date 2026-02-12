'use client';

import { useState, useEffect } from 'react';
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

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const sessionId = typeof window !== 'undefined' ? getSessionId() : 'guest';

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
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
  };

  const addToCart = async (item: CartItem) => {
    console.log('Adding to cart:', item);

    // Optimistic update
    const existing = cart.find(
      c => c.productId === item.productId && c.variantId === item.variantId
    );
    let newCart;
    if (existing) {
      newCart = cart.map(c =>
        c.productId === item.productId && c.variantId === item.variantId
          ? { ...c, quantity: c.quantity + item.quantity }
          : c
      );
    } else {
      newCart = [...cart, item];
    }
    setCart(newCart);

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

    // Also save to localStorage as backup
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = async (productId: string, variantId: string, quantity: number) => {
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
  };

  const removeFromCart = async (productId: string, variantId: string) => {
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
  };

  const clearCart = async () => {
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
  };

  return { cart, addToCart, updateQuantity, removeFromCart, clearCart, loading, sessionId, fetchCart };
}