import { useLocalStorage } from './useLocalStorage';
import { Customer } from '@/types';

export function useCustomers() {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', []);

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const existing = customers.find(c => c.email === customer.email);
    if (existing) return existing;

    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCustomers([...customers, newCustomer]);
    return newCustomer;
  };

  return { customers, addCustomer };
}
