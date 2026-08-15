"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import styles from "./Preloader.module.css";

export function Preloader() {
  const pathname = usePathname();
  const [isDone, setIsDone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelTopRef = useRef<HTMLDivElement>(null);
  const panelBottomRef = useRef<HTMLDivElement>(null);
  const lightLineRef = useRef<HTMLDivElement>(null);
  const centerDotRef = useRef<HTMLDivElement>(null);
  const apertureBoxRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;

    // Lock page scroll during animation sequence
    document.body.style.overflow = "hidden";

    // Create GSAP Master Timeline for 100% Lockstep Synchronized Reveal
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setIsDone(true);
        }
      });

      // ==========================================
      // PHASE 1: Razor-thin Light Beam Line & Dot (First Image)
      // ==========================================
      tl.to(lightLineRef.current, {
        scaleX: 1,
        duration: 0.7,
        ease: "expo.inOut",
      })
      .to(centerDotRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(2)",
      }, "-=0.2")

      // ==========================================
      // PHASE 2: Letterbox Window & Curtain Panels Open in Synchronized Lockstep (Second Image)
      // ==========================================
      .to(panelTopRef.current, {
        y: "-19vh",
        duration: 0.85,
        ease: "power3.inOut",
      }, "+=0.1")
      .to(panelBottomRef.current, {
        y: "19vh",
        duration: 0.85,
        ease: "power3.inOut",
      }, "-=0.85")
      .to(apertureBoxRef.current, {
        height: "38vh",
        duration: 0.85,
        ease: "power3.inOut",
      }, "-=0.85")
      .to(lightLineRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power1.out",
      }, "-=0.85")
      .to(centerDotRef.current, {
        scale: 3,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
      }, "-=0.7")
      .to(logoContainerRef.current, {
        opacity: 1,
        scale: 1.05,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.35")
      .to(subTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
      }, "-=0.4")

      // ==========================================
      // PHASE 3: Curtain Panels & Viewport Open 100vh Full Viewport in Lockstep (Third Image)
      // ==========================================
      .to(panelTopRef.current, {
        y: "-50vh",
        duration: 0.95,
        ease: "power4.inOut",
      }, "+=0.8")
      .to(panelBottomRef.current, {
        y: "50vh",
        duration: 0.95,
        ease: "power4.inOut",
      }, "-=0.95")
      .to(apertureBoxRef.current, {
        height: "100vh",
        duration: 0.95,
        ease: "power4.inOut",
      }, "-=0.95")
      .to(logoContainerRef.current, {
        scale: 1.15,
        opacity: 0,
        duration: 0.6,
        ease: "power3.in",
      }, "-=0.75")
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: "sine.out",
      }, "-=0.2");
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (pathname !== "/" || isDone) return null;

  return (
    <div ref={overlayRef} className={styles.preloaderOverlay}>
      {/* Dark Framing Panels above and below Letterbox */}
      <div ref={panelTopRef} className={styles.letterboxPanelTop} />
      <div ref={panelBottomRef} className={styles.letterboxPanelBottom} />

      {/* Phase 1: Razor-thin Light Line (First Image) */}
      <div ref={lightLineRef} className={styles.lightLine} />

      {/* Phase 1 & 2: Center Glow Dot */}
      <div ref={centerDotRef} className={styles.centerDot} />

      {/* Phase 2 & 3: Clear Letterbox Window Revealing LIVE Website Background */}
      <div ref={apertureBoxRef} className={styles.apertureBox}>
        {/* Center Scaled Logo Image & Subtext inside Letterbox */}
        <div
          ref={logoContainerRef}
          className={styles.logoContainer}
          style={{ opacity: 0, transform: "scale(0.85) translateY(18px)" }}
        >
          <Image
            src="/images/logo.png"
            alt="Brooq Al Khalij Official Logo"
            width={400}
            height={100}
            className={styles.brandLogoImg}
            priority
          />
          <p
            ref={subTextRef}
            className={styles.logoSubText}
            style={{ opacity: 0, transform: "translateY(12px)" }}
          >
            Heavy Industrial &amp; Steel Engineering
          </p>
        </div>
      </div>
    </div>
  );
}
