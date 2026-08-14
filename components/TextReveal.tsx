"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: any;
  animation?: "slide-up" | "blur" | "split-words" | "fade-stagger";
  delay?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
}

export function TextReveal({
  children,
  className = "",
  as: Component = "div",
  animation = "slide-up",
  delay = 0,
  duration = 1.0,
  stagger = 0.04,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const ctx = gsap.context(() => {
      if (animation === "split-words" && typeof children === "string") {
        const words = el.querySelectorAll(".gsap-word");
        if (words.length > 0) {
          gsap.fromTo(
            words,
            {
              y: "110%",
              opacity: 0,
              rotateX: -20,
            },
            {
              y: "0%",
              opacity: 1,
              rotateX: 0,
              duration: duration,
              stagger: stagger,
              delay: delay,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                once: true,
                toggleActions: "play none none none",
              },
            }
          );
        }
      } else if (animation === "blur") {
        gsap.fromTo(
          el,
          {
            filter: "blur(14px)",
            opacity: 0,
            y: 35,
          },
          {
            filter: "blur(0px)",
            opacity: 1,
            y: 0,
            duration: duration * 1.2,
            delay: delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              once: true,
              toggleActions: "play none none none",
            },
          }
        );
      } else if (animation === "fade-stagger") {
        const childrenNodes = el.children;
        if (childrenNodes.length > 0) {
          gsap.fromTo(
            childrenNodes,
            {
              y: 35,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: duration,
              stagger: stagger * 2,
              delay: delay,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true,
                toggleActions: "play none none none",
              },
            }
          );
        } else {
          gsap.fromTo(
            el,
            {
              y: 35,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: duration,
              delay: delay,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true,
                toggleActions: "play none none none",
              },
            }
          );
        }
      } else {
        // Default "slide-up"
        gsap.fromTo(
          el,
          {
            y: 45,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: duration,
            delay: delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              once: true,
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [animation, delay, duration, stagger, children]);

  if (animation === "split-words" && typeof children === "string") {
    const words = children.split(" ");
    return (
      // @ts-ignore
      <Component ref={containerRef} className={className} style={{ overflow: "hidden" }}>
        {words.map((word, i) => (
          <span
            key={i}
            className="gsap-word"
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              transformOrigin: "left center",
              willChange: "transform, opacity",
            }}
          >
            {word}{i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Component>
    );
  }

  return (
    // @ts-ignore
    <Component ref={containerRef} className={className} style={{ willChange: "transform, opacity" }}>
      {children}
    </Component>
  );
}
