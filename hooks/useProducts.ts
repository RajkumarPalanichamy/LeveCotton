'use client';

import { useState, useEffect } from 'react';

export interface Product {
  _id?: string;
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  color?: string;
  fabric?: string;
  inStock: boolean;
}

export function useProducts(filter?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = filter ? `/api/products?filter=${filter}` : '/api/products';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched products:', data);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product: Omit<Product, '_id'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      if (response.ok) {
        fetchProducts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create product:', error);
      return false;
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...product })
      });
      
      if (response.ok) {
        fetchProducts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update product:', error);
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (response.ok) {
        fetchProducts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
}