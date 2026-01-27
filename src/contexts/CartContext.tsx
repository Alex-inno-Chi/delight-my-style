import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './ProductContext';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'fashion_store_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));
    setItems(newItems);
  };

  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    const existingIndex = items.findIndex(
      item => item.product.id === product.id && item.size === size && item.color === color
    );

    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].quantity += quantity;
      saveItems(updated);
    } else {
      saveItems([...items, { product, quantity, size, color }]);
    }
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    saveItems(items.filter(
      item => !(item.product.id === productId && item.size === size && item.color === color)
    ));
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    const updated = items.map(item =>
      item.product.id === productId && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    );
    saveItems(updated);
  };

  const clearCart = () => saveItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
