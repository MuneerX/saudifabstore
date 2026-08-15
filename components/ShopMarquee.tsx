"use client";

import React from "react";
import styles from "./ShopMarquee.module.css";

const MARQUEE_ITEMS = [
  "ISO 9001:2015 CERTIFIED FACILITY",
  "DIRECT MANUFACTURER PRICING",
  "FAST NATIONWIDE & REGIONAL DELIVERY",
  "HEAVY-DUTY INDUSTRIAL GRADE",
  "100% QUALITY ASSURANCE GUARANTEE",
  "EXPERT TECHNICAL SUPPORT & CONSULTATION",
  "PRECISION STEEL FABRICATION & TORQUING",
];

export function ShopMarquee() {
  return (
    <div className={styles.marqueeWrapper}>
      <div className={styles.marqueeTrack}>
        {/* Render twice for continuous infinite scroll loop */}
        <div className={styles.marqueeGroup}>
          {MARQUEE_ITEMS.map((item, index) => (
            <div key={`group1-${index}`} className={styles.marqueeItem}>
              <span>{item}</span>
              <span className={styles.pipeSeparator}>|</span>
            </div>
          ))}
        </div>
        <div className={styles.marqueeGroup}>
          {MARQUEE_ITEMS.map((item, index) => (
            <div key={`group2-${index}`} className={styles.marqueeItem}>
              <span>{item}</span>
              <span className={styles.pipeSeparator}>|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShopMarquee;
