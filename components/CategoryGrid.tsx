"use client";

import React from "react";
import Image from "next/image";
import styles from "./CategoryGrid.module.css";

interface CategoryCard {
  id: string;
  title: string;
  imageSrc: string;
  alt: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: "storage-containers",
    title: "Storage & Containers",
    imageSrc: "/images/home/category_grid/container_3.jpeg",
    alt: "Storage & Containers"
  },
  {
    id: "lifting-handling",
    title: "Lifting & Material Handling",
    imageSrc: "/images/home/category_grid/lifting_3.jpeg",
    alt: "Lifting & Material Handling"
  },
  {
    id: "safety-protection",
    title: "Safety & Protection",
    imageSrc: "/images/home/category_grid/safety_3.jpeg",
    alt: "Safety & Protection"
  }
];

export function CategoryGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {CATEGORIES.map((item) => (
          <div key={item.id} className={styles.card}>
            <Image
              src={item.imageSrc}
              alt={item.alt}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={95}
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
