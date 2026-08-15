"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { ParallaxElement } from "./ParallaxElement";
import { TextReveal } from "./TextReveal";
import styles from "./StudioBanner.module.css";

export function StudioBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.bannerCard}>
        {/* Background product video with Parallax */}
        <ParallaxElement speed={-0.10} className={styles.bgWrapper}>
          <video
            src="/images/home/category_grid/custom.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={styles.bgImage}
            style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
          />
          <div className={styles.overlay} />
        </ParallaxElement>

        {/* Content Box at Bottom Right */}
        <div className={styles.contentBox}>
          <TextReveal animation="blur">
            <h2 className={styles.title}>
              <span className={styles.headingMain}>Planning your custom steel project?</span>
              <span className={styles.headingSub}>We've got your back with Brooq Al Khalij engineering.</span>
            </h2>
          </TextReveal>

          <Link href="/contact" className={styles.configureBtn}>
            <span>Request Quote</span>
            <span className={styles.iconBadge}>
              <Sparkles size={16} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
