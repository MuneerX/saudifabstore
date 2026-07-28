"use client";

import React from "react";
import Image from "next/image";
import { SkipBack, Pause, SkipForward } from "lucide-react";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.heroSection}>
      {/* 1. Cinematic Background */}
      <div className={styles.heroBackground}>
        {/* Placeholder background, user can replace with their cinematic image */}
        <Image
          src="/images/hero-bg.png"
          alt="Cinematic background"
          fill
          priority
          className={styles.heroImage}
          sizes="100vw"
        />
      </div>

      {/* 2. Floating Channel Widget (Top Right) */}
      <div className={styles.channelWidget}>
        <div className={styles.widgetHeader}>
          <div className={styles.channelInfo}>
            <span className={styles.channelLabel}>CHANNEL</span>
            <span className={styles.channelNumber}>003</span>
          </div>
          <div className={styles.playbackControls}>
            <button className={styles.controlBtn} aria-label="Previous">
              <SkipBack size={12} fill="currentColor" />
            </button>
            <button className={styles.controlBtn} aria-label="Pause">
              <Pause size={12} fill="currentColor" />
            </button>
            <button className={styles.controlBtn} aria-label="Next">
              <SkipForward size={12} fill="currentColor" />
            </button>
          </div>
        </div>
        
        {/* Thumbnails row */}
        <div className={styles.thumbnailRow}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.thumbnail}>
              {/* Placeholders for video thumbnails */}
              <Image
                src="/images/hero-bg.png"
                alt={`Thumbnail ${i}`}
                fill
                className={styles.thumbImg}
                sizes="80px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Massive Marquee Text (Bottom) */}
      <div className={styles.marqueeContainer}>
        <h1 className={styles.marqueeText}>
          Brooq Al Khalij Group
        </h1>
      </div>
    </section>
  );
}