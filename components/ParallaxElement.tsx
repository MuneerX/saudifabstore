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
  className = "",
  style = {}
}: ParallaxElementProps) {
  return (
    <div
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}



