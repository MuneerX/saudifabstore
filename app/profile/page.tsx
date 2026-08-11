"use client";

import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Profile } from "@/components/ui/profile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#FAF9F5]">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#111111] rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-gray-500 font-sans">Loading Client Portal...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5]">
      <Navbar hasBorder={true} isLight={true} />
      <main className="flex-1">
        <Profile />
      </main>
      <div style={{ position: 'relative' }}>
        <Footer />
      </div>
    </div>
  );
}