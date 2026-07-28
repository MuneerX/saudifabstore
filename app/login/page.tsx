"use client";

import React from "react";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { StayUpToDate } from "@/components/StayUpToDate";
import Footer from "@/components/Footer";
import { SignIn2 } from "@/components/ui/clean-minimal-sign-in";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Navbar hasBorder={true} />
      <main className="flex-1">
        <SignIn2 />
      </main>
      <div style={{ position: 'relative' }}>
        <StayUpToDate />
        <Footer />
      </div>
    </div>
  );
}