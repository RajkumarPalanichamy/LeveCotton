'use client';

import { useState, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = 'guest';

  useEffect(() => {
    // Load from localStorage first for instant UI
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`/api/wishlist?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.items || []);
        localStorage.setItem('wishlist', JSON.stringify(data.items || []));
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  const addToWishlist = async (product: WishlistItem) => {
    console.log('Adding to wishlist:', product);
    const exists = wishlist.find(item => item.id === product.id);
    if (exists) return;
    
    const newWishlist = [...wishlist, product];
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    console.log('Wishlist updated:', newWishlist);
  };

  const removeFromWishlist = async (productId: string) => {
    const newWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product: WishlistItem) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    wishlistCount: wishlist.length,
    loading
  };
}