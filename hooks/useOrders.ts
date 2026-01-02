'use client';

import { useLocalStorage } from './useLocalStorage';
import { Order } from '@/types';

export function useOrders() {
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return { orders, addOrder, updateOrderStatus };
}
