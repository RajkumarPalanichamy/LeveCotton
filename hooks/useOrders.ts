'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: order.customerInfo?.name,
          customerEmail: order.customerInfo?.email,
          customerPhone: order.customerInfo?.phone,
          shippingAddress: order.customerInfo?.address || order.shippingAddress
            ? `${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.zipCode}`
            : '',
          items: order.items,
          totalAmount: order.totalAmount,
          orderStatus: order.status || 'pending',
          paymentStatus: 'pending',
          orderType: 'whatsapp',
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newOrder: Order = {
          ...order,
          id: data.orderId,
          createdAt: new Date().toISOString(),
        };
        setOrders(prev => [...prev, newOrder]);
        return newOrder;
      }
      return null;
    } catch (error) {
      console.error('Failed to add order:', error);
      return null;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, orderStatus: status }),
      });

      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  return { orders, loading, fetchOrders, addOrder, updateOrderStatus };
}
