"use client";

import React from "react";
import { ParallaxElement } from "./ParallaxElement";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.heroSection}>
      {/* 1. Cinematic Background with Parallax */}
      <ParallaxElement speed={-0.10} className={styles.heroBackground}>
        <video
          className={styles.heroVideo}
          src="/images/video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </ParallaxElement>

      {/* 3. Massive Marquee Text (Bottom) */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          <span className={styles.marqueeText}>Brooq Al Khalij Group</span>
          <span className={styles.marqueeText}>Brooq Al Khalij Group</span>
          <span className={styles.marqueeText}>Brooq Al Khalij Group</span>
          <span className={styles.marqueeText}>Brooq Al Khalij Group</span>
        </div>
      </div>
    </section>
  );
}