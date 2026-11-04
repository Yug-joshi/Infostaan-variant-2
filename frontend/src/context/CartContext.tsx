import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { CartItem, PDFResource } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (pdf: PDFResource) => void;
  removeFromCart: (pdfId: string) => void;
  clearCart: () => void;
  isInCart: (pdfId: string) => boolean;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'infostaan_cart_items';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.error('Failed to parse cart items from localStorage', e);
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart items to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (pdf: PDFResource) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.pdf.id === pdf.id || item.pdf.slug === pdf.slug);
      if (existing) {
        return prev; // PDF is a digital download, already in cart
      }
      return [
        ...prev,
        {
          pdf,
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const removeFromCart = (pdfId: string) => {
    setCartItems((prev) => prev.filter((item) => item.pdf.id !== pdfId && item.pdf.slug !== pdfId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (pdfId: string): boolean => {
    return cartItems.some((item) => item.pdf.id === pdfId || item.pdf.slug === pdfId);
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.pdf.price * item.quantity, 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.length;
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
