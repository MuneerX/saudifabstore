"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SignUp2 } from "@/components/ui/clean-minimal-sign-up";

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar hasBorder={true} />
      <main className="flex-1">
        <SignUp2 />
      </main>
      <div style={{ position: 'relative' }}>
        <Footer />
      </div>
    </div>
  );
}