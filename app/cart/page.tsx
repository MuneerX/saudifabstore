"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/components/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { openCart } = useCartContext();

  useEffect(() => {
    openCart();
    router.replace("/products");
  }, [openCart, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8 text-center font-sans">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-700">Opening Your Bag...</p>
      </div>
    </div>
  );
}