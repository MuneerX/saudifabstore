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
            src="/images/home/company/img_bg_2.png"
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
              quality structures <br />
              <span className={styles.lineThree}>for your business.</span>
            </h2>
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Sub-heading and Button Container (Columns 7 to 10) */}
          <div className={styles.contentWrap}>
            <p>
              As a customer-driven organization, BROOQ AL KHALIJ GEN. <br />
              CONT. CO. is able to respond to the changing needs and <br />
              producing quality product to satisfy the needs <br />
              of our esteemed customers.
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
