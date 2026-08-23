"use client";

import React, { useEffect, useState } from "react";
import { useCurrentFrame } from "remotion";

export interface PerspectiveMarqueeProps {
  items?: string[];
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  pixelsPerFrame?: number;
  rotateY?: number;
  rotateX?: number;
  perspective?: number;
  fadeColor?: string;
  background?: string;
  speed?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), 'Host Grotesk', -apple-system, BlinkMacSystemFont, sans-serif";

const DEFAULT_ITEMS = [
  "Contracting Est.",
  "Safety Trading",
  "Protorc Bolting",
  "Forklift Repair",
  "Saudi Fab Stone",
  "Chemical Solutions",
  "Packaging & Woodworks",
];

export function PerspectiveMarquee({
  items = DEFAULT_ITEMS,
  fontSize = 64,
  color = "#ffffff",
  fontWeight = 600,
  pixelsPerFrame = 2,
  rotateY = -24,
  rotateX = 6,
  perspective = 1200,
  fadeColor = "transparent",
  background = "transparent",
  speed = 1,
  className,
}: PerspectiveMarqueeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1280);

  // Use Remotion frame if available, otherwise continuous requestAnimationFrame loop
  let remotionFrame = 0;
  try {
    remotionFrame = useCurrentFrame();
  } catch {
    remotionFrame = 0;
  }

  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setAnimFrame((prev) => prev + 1);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const updateWidth = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.getBoundingClientRect().width);
        }
      };
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  const activeFrame = (remotionFrame || animFrame) * speed;

  const itemPadding = fontSize * 0.9;
  const approxItemWidth = items.reduce(
    (acc, item) => acc + item.length * fontSize * 0.6 + itemPadding,
    0,
  );

  const offset = -((activeFrame * pixelsPerFrame) % approxItemWidth);
  const rendered = [...items, ...items, ...items, ...items];

  const showVignette = fadeColor && fadeColor !== "transparent";
  const centerPoint = containerWidth / 2;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "350px",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        perspective: `${perspective}px`,
        maskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            transform: `translateX(${offset}px)`,
            willChange: "transform",
          }}
        >
          {rendered.map((item, i) => {
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontFamily: FONT_FAMILY,
                  fontSize,
                  fontWeight: 700,
                  color,
                  letterSpacing: "-0.02em",
                  paddingRight: itemPadding,
                  filter: "none",
                  opacity: 1,
                  textShadow: "0 2px 10px rgba(0,0,0,0.06)",
                }}
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

