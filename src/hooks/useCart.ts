import { useLocalStorage } from './useLocalStorage';
import { CartItem } from '@/types';

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

  const addToCart = (item: CartItem) => {
    const existing = cart.find(
      c => c.productId === item.productId && c.variantId === item.variantId
    );
    
    if (existing) {
      setCart(
        cart.map(c =>
          c.productId === item.productId && c.variantId === item.variantId
            ? { ...c, quantity: c.quantity + item.quantity }
            : c
        )
      );
    } else {
      setCart([...cart, item]);
    }
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
    } else {
      setCart(
        cart.map(c =>
          c.productId === productId && c.variantId === variantId
            ? { ...c, quantity }
            : c
        )
      );
    }
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart(cart.filter(c => !(c.productId === productId && c.variantId === variantId)));
  };

  const clearCart = () => {
    setCart([]);
  };

  return { cart, addToCart, updateQuantity, removeFromCart, clearCart };
}
