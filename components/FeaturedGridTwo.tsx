"use client";

import React from "react";
import Image from "next/image";
import styles from "./FeaturedGridTwo.module.css";

interface GridItem {
  id: string;
  title: string;
  imageSrc: string;
  alt: string;
}

const ITEMS: GridItem[] = [
  {
    id: "workshop-equipment",
    title: "Workshop Equipment",
    imageSrc: "/images/home/category_grid/workshop_2k.jpeg",
    alt: "Workshop Equipment"
  },
  {
    id: "trolleys-transportation",
    title: "Trolleys & Transportation",
    imageSrc: "/images/home/category_grid/forklift_2k.jpeg",
    alt: "Trolleys & Transportation"
  }
];

export function FeaturedGridTwo() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {ITEMS.map((item) => (
          <div key={item.id} className={styles.card}>
            <Image
              src={item.imageSrc}
              alt={item.alt}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className={styles.gradientOverlay} />
            <h3 className={styles.label}>{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
