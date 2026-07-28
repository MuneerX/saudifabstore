"use client";

import React from "react";
import Image from "next/image";
import styles from "./BrandLogos.module.css"; // Import CSS module

export function BrandLogos() {
  // In a real app, these would be actual brand logos
  const brands = [
    { id: 1, name: "Versace", logo: "/home/versace-logo.svg" },
    { id: 2, name: "Zara", logo: "/home/zara-logo-1 1.svg" },
    { id: 3, name: "Gucci", logo: "/home/gucci-logo-1 1.svg" },
    { id: 4, name: "Prada", logo: "/home/prada-logo-1 1.svg" },
    { id: 5, name: "Calvin Klein", logo: "/home/calvin klein logo.svg" },
  ];

  return (
    <section className={styles.brandLogosSection}>
      <div className={styles.container}>
        <div className={styles.logosGrid}>
          {brands.map((brand) => (
            <div key={brand.id} className={styles.logoItem}>
              <Image src={brand.logo} alt={brand.name} width={120} height={32} className={styles.logoImage} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}