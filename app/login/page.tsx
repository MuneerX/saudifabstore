"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SignIn2 } from "@/components/ui/clean-minimal-sign-in";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar hasBorder={true} />
      <main className="flex-1">
        <SignIn2 />
      </main>
      <div style={{ position: 'relative' }}>
        <Footer />
      </div>
    </div>
  );
}