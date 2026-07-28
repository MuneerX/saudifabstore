"use client";

import React from "react";
import styles from "./TopBar.module.css";

const TICKER_ITEMS = [
  "500+ PHARMACIES",
  "TRANSPARENT PRICING, NO HIDDEN FEES",
  "BOARD CERTIFIED PHYSICIANS",
  "US SOURCED INGREDIENTS",
  "TRUSTED BY OVER 100K SUBSCRIBERS",
  "100% ONLINE PROCESS"
];

export function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.topBarContainer}>
        <div className={styles.segmentedGrid}>
          {TICKER_ITEMS.map((text, idx) => (
            <div key={idx} className={styles.item}>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}