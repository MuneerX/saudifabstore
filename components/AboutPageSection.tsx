"use client";

import React from "react";
import Image from "next/image";
import { ParallaxElement } from "./ParallaxElement";
import { TextReveal } from "./TextReveal";
import styles from "./AboutPageSection.module.css";

export function AboutPageSection() {
  return (
    <>
      <section className={styles.aboutSection}>
        {/* Full Section Background Image Layer with Parallax */}
        <ParallaxElement speed={-0.10} className={styles.bgWrapper}>
          <Image
            src="/images/about/about_2.png"
            alt="Saudi Fab Store Company history and background"
            fill
            className={styles.bgImage}
            sizes="100vw"
            priority
          />
        </ParallaxElement>

        {/* Foreground Content Grid */}
        <div className={styles.introGrid}>
          {/* Headline Wrapper (Columns 7 to 12) */}
          <div className={styles.headlineWrap}>
            <TextReveal animation="slide-up">
              <h2>
                Pioneering industrial excellence across KSA{" "}
                <span className={styles.lineThree}>since the year 2000.</span>
              </h2>
            </TextReveal>
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Sub-heading Container (Columns 7 to 10) */}
          <div className={styles.contentWrap}>
            <TextReveal animation="blur" delay={0.2}>
              <p>
                For over two decades, Saudi Fab Store has stood as a cornerstone of structural engineering and contracting in the Eastern Province. From our advanced facilities in Dammam, we deliver custom steel fabrication, high-precision sandblasting, and premium coatings that empower infrastructure projects nationwide.
              </p>
            </TextReveal>
          </div>
        </div>
      </section>
    </>
  );
}

