"use client";

import React from "react";
import Image from "next/image";
import { PerspectiveMarquee } from "./ui/remocn-perspective-marquee";
import styles from "./HowItWorksSection.module.css";

const SUB_BRANDS_ITEMS = [
  "Contracting Est.",
  "Safety Trading",
  "Protorc Bolting",
  "Forklift Repair",
  "Brooq Stone",
  "Chemical Solutions",
  "Packaging & Woodworks",
];

export function HowItWorksSection() {
  return (
    <section className={styles.section}>
      {/* Ambient Brand Fog Glow */}
      <div className={styles.brandFogGlow} />

      {/* Main Container directly in section (No card wrapper) */}
      <div className={styles.container}>
        {/* Top Header Block */}
        <div className={styles.topBlock}>
          <p className={styles.subText}>
            The company operates under several business divisions offering specialized services to satisfy customer needs.
          </p>
          <h2 className={styles.headline}>Our Sub-Brands</h2>
        </div>

        {/* Clean 3D Perspective Marquee Component */}
        <div className={styles.marqueeContainer}>
          <PerspectiveMarquee
            items={SUB_BRANDS_ITEMS}
            rotateY={-22}
            rotateX={6}
            perspective={1200}
            pixelsPerFrame={2.2}
            fontSize={48}
            fontWeight={600}
            color="#111827"
            fadeColor="#FBF9F4"
            background="transparent"
          />
        </div>
      </div>
    </section>
  );
}
