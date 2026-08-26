"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
          <Toaster
            position="top-left"
            expand={false}
            closeButton={false}
            toastOptions={{
              style: {
                background: "transparent",
                border: "none",
                boxShadow: "none",
                padding: 0,
              },
            }}
          />
        </CartProvider>
      </WishlistProvider>
    </SessionProvider>
  );
}