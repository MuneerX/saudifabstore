"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./AboutSection.module.css";
import { TreatmentQuizModal } from "./TreatmentQuizModal";

export function AboutSection() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <>
      <section className={styles.aboutSection}>
        {/* Full Section Background Image Layer */}
        <div className={styles.bgWrapper}>
          <Image
            src="/images/about/about_2.png"
            alt="Brooq Al Khalij Company background"
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
              Delivering proven <br />
              industrial solutions <br />
              <span className={styles.lineThree}>engineered to last.</span>
            </h2>
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Sub-heading and Button Container (Columns 7 to 10) */}
          <div className={styles.contentWrap}>
            <p>
              Established in 2000 in Dammam, BROOQ AL KHALIJ is a premier industrial <br />
              and contracting conglomerate. We deliver custom steel fabrication, protective <br />
              coatings, and turnkey engineering solutions tailored to empower your operations.
            </p>

            <button
              className={styles.primaryButton}
              onClick={() => setIsQuizOpen(true)}
            >
              Explore Our Services
            </button>
          </div>
        </div>
      </section>

      <TreatmentQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </>
  );
}
