export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  variants: ProductVariant[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: {
    productId: string;
    variantId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'shipped' | 'delivered';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}
