"use client";

import React, { useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { StayUpToDate } from "@/components/StayUpToDate";
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
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Navbar hasBorder={true} />
      <main className="flex-1">
        <Profile />
      </main>
      <div style={{ position: 'relative' }}>
        <StayUpToDate />
        <Footer />
      </div>
    </div>
  );
}