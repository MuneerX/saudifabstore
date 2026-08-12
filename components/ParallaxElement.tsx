"use client";

import React, { useEffect, useRef } from "react";

interface ParallaxElementProps {
  children: React.ReactNode;
  speed?: number; // e.g. -0.2 (slower background), 0.15 (floating foreground)
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxElement({
  children,
  speed = -0.2,
  className = "",
  style = {}
}: ParallaxElementProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    let isVisible = false;
    let cachedInitialTop = 0;

    const measurePosition = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      cachedInitialTop = rect.top + window.scrollY;
    };

    measurePosition();

    // IntersectionObserver to avoid scroll math when element is offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            updatePosition();
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(el);

    const updatePosition = () => {
      if (!isVisible || !el) return;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      // Calculate offset from cached top - zero layout thrashing
      const elementCenter = cachedInitialTop + el.offsetHeight / 2;
      const viewportCenter = scrollY + viewportHeight / 2;
      const centerOffset = elementCenter - viewportCenter;
      const translateY = centerOffset * speed;

      el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
    };

    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(updatePosition);
    };

    const handleResize = () => {
      measurePosition();
      updatePosition();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    updatePosition();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
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
