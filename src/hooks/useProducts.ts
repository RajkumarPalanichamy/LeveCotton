import { useLocalStorage } from './useLocalStorage';
import { Product } from '@/types';

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Silk Blouse',
    description: 'Luxurious silk blouse perfect for any occasion',
    price: 89.99,
    category: 'Tops',
    images: ['https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800'],
    variants: [
      { id: 'v1', size: 'S', color: 'White', stock: 10, sku: 'ESB-W-S' },
      { id: 'v2', size: 'M', color: 'White', stock: 15, sku: 'ESB-W-M' },
      { id: 'v3', size: 'L', color: 'White', stock: 8, sku: 'ESB-W-L' },
      { id: 'v4', size: 'S', color: 'Black', stock: 12, sku: 'ESB-B-S' },
      { id: 'v5', size: 'M', color: 'Black', stock: 20, sku: 'ESB-B-M' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Summer Floral Dress',
    description: 'Light and breezy floral print dress',
    price: 129.99,
    category: 'Dresses',
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800'],
    variants: [
      { id: 'v6', size: 'XS', color: 'Floral', stock: 5, sku: 'SFD-F-XS' },
      { id: 'v7', size: 'S', color: 'Floral', stock: 8, sku: 'SFD-F-S' },
      { id: 'v8', size: 'M', color: 'Floral', stock: 12, sku: 'SFD-F-M' },
      { id: 'v9', size: 'L', color: 'Floral', stock: 6, sku: 'SFD-F-L' },
    ],
    createdAt: new Date().toISOString(),
  },
];

export function useProducts() {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return { products, addProduct, updateProduct, deleteProduct };
}
