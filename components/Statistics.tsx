"use client";

import React from "react";
import styles from "./Statistics.module.css"; // Import CSS module

export function Statistics() {
  const stats = [
    { id: 1, value: "200+", label: "International Brands" },
    { id: 2, value: "2,000+", label: "High-Quality Products" },
    { id: 3, value: "30,000+", label: "Happy Customers" },
  ];

  return (
    <section className={styles.statisticsSection}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.id} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}