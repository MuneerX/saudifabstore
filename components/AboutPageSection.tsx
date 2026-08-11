"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./AboutPageSection.module.css";
import { TreatmentQuizModal } from "./TreatmentQuizModal";

export function AboutPageSection() {
  return (
    <>
      <section className={styles.aboutSection}>
        {/* Full Section Background Image Layer */}
        <div className={styles.bgWrapper}>
          <Image
            src="/images/about/about_2.png"
            alt="Brooq Al Khalij Company history and background"
            fill
            className={styles.bgImage}
            sizes="100vw"
            priority
          />
        </div>

        {/* Foreground Content Grid */}
        <div className={styles.introGrid}>
          {/* Headline Wrapper (Columns 7 to 12) */}
          <div className={styles.headlineWrap}>
            <h2>
              Pioneering industrial excellence across KSA{" "}
              <span className={styles.lineThree}>since the year 2000.</span>
            </h2>
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Sub-heading Container (Columns 7 to 10) */}
          <div className={styles.contentWrap}>
            <p>
              For over two decades, BROOQ AL KHALIJ has stood as a cornerstone of structural engineering and contracting in the Eastern Province. From our advanced facilities in Dammam, we deliver custom steel fabrication, high-precision sandblasting, and premium coatings that empower infrastructure projects nationwide.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
