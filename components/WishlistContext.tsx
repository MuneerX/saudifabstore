"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { INITIAL_PRODUCTS } from "@/lib/data/initialProducts";

interface WishlistContextType {
  wishlist: any[];
  loading: boolean;
  toggleWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "saudifab_wishlist_items";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize wishlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load wishlist from localStorage:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  const saveWishlist = (items: any[]) => {
    setWishlist(items);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save wishlist to localStorage:", e);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => {
      const id = typeof item === "string" ? item : item?._id || item?.id;
      return id === productId;
    });
  };

  const toggleWishlist = async (productOrId: any) => {
    const prodId = typeof productOrId === "string" ? productOrId : (productOrId?._id || productOrId?.id);
    if (!prodId) return;

    let fullProduct = typeof productOrId === "object" ? productOrId : null;
    if (!fullProduct) {
      fullProduct = INITIAL_PRODUCTS.find(p => p._id === prodId) || { _id: prodId, name: "Industrial Product", price: 150 };
    }

    const exists = isInWishlist(prodId);

    let updatedWishlist: any[] = [];
    if (exists) {
      updatedWishlist = wishlist.filter(item => {
        const id = typeof item === "string" ? item : item?._id || item?.id;
        return id !== prodId;
      });
      toast.success(`Removed "${fullProduct.name || 'Item'}" from your Wishlist`);
    } else {
      updatedWishlist = [fullProduct, ...wishlist];
      toast.success(`Added "${fullProduct.name || 'Item'}" to your Wishlist`);
    }

    saveWishlist(updatedWishlist);

    // Sync with backend if logged in
    if (session?.user) {
      try {
        if (exists) {
          await fetch("/api/wishlist", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: prodId }),
          });
        } else {
          await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: prodId }),
          });
        }
      } catch (err) {
        console.warn("Wishlist backend sync notice:", err);
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const productToRemove = wishlist.find(item => {
      const id = typeof item === "string" ? item : item?._id || item?.id;
      return id === productId;
    });
    const productName = productToRemove?.name || "Item";

    const updatedWishlist = wishlist.filter(item => {
      const id = typeof item === "string" ? item : item?._id || item?.id;
      return id !== productId;
    });
    saveWishlist(updatedWishlist);
    toast.success(`Removed "${productName}" from your Wishlist`);

    if (session?.user) {
      try {
        await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: productId }),
        });
      } catch (err) {
        console.warn("Wishlist remove sync notice:", err);
      }
    }
  };

  const clearWishlist = () => {
    saveWishlist([]);
    toast.success("Wishlist cleared");
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlistContext must be used within a WishlistProvider");
  }
  return context;
}
