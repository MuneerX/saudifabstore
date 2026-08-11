"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useCart } from "@/lib/hooks/useCart";

interface CartContextType {
  cart: any;
  loading: boolean;
  error: any;
  fetchCart: (session?: any) => Promise<void>;
  addToCart: (productId: string, quantity: number, size?: string, color?: string) => Promise<any>;
  updateCart: (productId: string, quantity: number) => Promise<any>;
  removeFromCart: (productId: string) => Promise<any>;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartHook = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCartAndOpen = async (productId: string, quantity: number, size?: string, color?: string) => {
    const result = await cartHook.addToCart(productId, quantity, size, color);
    setIsCartOpen(true);
    return result;
  };

  return (
    <CartContext.Provider
      value={{
        ...cartHook,
        addToCart: addToCartAndOpen,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
