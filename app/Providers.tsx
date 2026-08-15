"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Preloader } from "@/components/Preloader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <Preloader />
        {children}
        <CartDrawer />
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
    </SessionProvider>
  );
}