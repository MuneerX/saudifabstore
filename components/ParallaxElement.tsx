"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxElementProps {
  children: React.ReactNode;
  speed?: number; // e.g. -0.15 (slower background), 0.15 (floating foreground)
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxElement({
  children,
  speed = -0.15,
  className = "",
  style = {}
}: ParallaxElementProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    // Shift percentage calculation for smooth scrub parallax
    const yPercentShift = speed * 100; // e.g. -15% vertical shift

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -yPercentShift },
        {
          yPercent: yPercentShift,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: "top bottom",
            end: "bottom top",
            scrub: true, // Direct 1-to-1 scroll position sync (holds position instantly when scroll pauses)
          }
        }
      );
    });

    return () => ctx.revert();
  }, [speed]);

  return (
    <div
      ref={targetRef}
      className={className}
      style={{
        willChange: "transform",
        ...style
      }}
    >
      {children}
    </div>
  );
}



