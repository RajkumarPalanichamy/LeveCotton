'use client';

import { useState, useEffect } from 'react';
import { CartItem } from '@/types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = 'guest';

  useEffect(() => {
    // Load from localStorage first for instant UI
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`/api/cart?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCart(data.items || []);
        localStorage.setItem('cart', JSON.stringify(data.items || []));
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (item: CartItem) => {
    console.log('Adding to cart:', item);
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
    localStorage.setItem('cart', JSON.stringify(newCart));
    console.log('Cart updated:', newCart);
  };

  const updateQuantity = async (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
    } else {
      const newCart = cart.map(c =>
        c.productId === productId && c.variantId === variantId
          ? { ...c, quantity }
          : c
      );
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  const removeFromCart = async (productId: string, variantId: string) => {
    const newCart = cart.filter(c => !(c.productId === productId && c.variantId === variantId));
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return { cart, addToCart, updateQuantity, removeFromCart, clearCart, loading };
}