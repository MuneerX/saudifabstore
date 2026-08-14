"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ParallaxElement } from "./ParallaxElement";
import { TextReveal } from "./TextReveal";
import styles from "./AboutSection.module.css";
import { TreatmentQuizModal } from "./TreatmentQuizModal";

export function AboutSection() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <>
      <section className={styles.aboutSection}>
        {/* Full Section Background Image Layer with Parallax */}
        <ParallaxElement speed={-0.10} className={styles.bgWrapper}>
          <Image
            src="/images/home/company/img_bg_2.png"
            alt="Brooq Al Khalij Company background"
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
                Delivering proven <br />
                industrial solutions <br />
                <span className={styles.lineThree}>engineered to last.</span>
              </h2>
            </TextReveal>
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Sub-heading and Button Container (Columns 7 to 10) */}
          <div className={styles.contentWrap}>
            <TextReveal animation="blur" delay={0.2}>
              <p>
                Established in 2000 in Dammam, BROOQ AL KHALIJ is a premier industrial <br />
                and contracting conglomerate. We deliver custom steel fabrication, protective <br />
                coatings, and turnkey engineering solutions tailored to empower your operations.
              </p>
            </TextReveal>

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
