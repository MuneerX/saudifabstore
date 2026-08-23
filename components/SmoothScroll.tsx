"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create GSAP ScrollSmoother instance
    const ctx = gsap.context(() => {
      smootherRef.current = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: 1.5, // Smooth duration in seconds for fluid mouse scrolling
        effects: false, // Disabled parallax effects for crisp stationary layout
        smoothTouch: 0.1, // Touch device scroll smoothing
      });
    });

    return () => {
      ctx.revert();
      if (smootherRef.current) {
        smootherRef.current.kill();
        smootherRef.current = null;
      }
    };
  }, []);

  // Reset scroll position and refresh ScrollTrigger on route navigation
  useEffect(() => {
    if (smootherRef.current) {
      smootherRef.current.scrollTop(0);
      ScrollTrigger.refresh();
    }
  }, [pathname]);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}

