'use client';

import { useState } from 'react';
import { Customer } from '@/types';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });

      const data = await response.json();

      if (data.success) {
        const newCustomer: Customer = {
          ...customer,
          id: data.customer.id,
          createdAt: data.customer.createdAt,
        };
        setCustomers(prev => {
          const exists = prev.find(c => c.id === newCustomer.id);
          if (exists) return prev.map(c => c.id === newCustomer.id ? newCustomer : c);
          return [...prev, newCustomer];
        });
        return newCustomer;
      }
      return null;
    } catch (error) {
      console.error('Failed to add customer:', error);
      return null;
    }
  };

  return { customers, loading, fetchCustomers, addCustomer };
}
