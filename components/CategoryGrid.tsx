"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./CategoryGrid.module.css";

interface CategoryCard {
  id: string;
  title: string;
  imageSrc: string;
  alt: string;
  href: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: "storage-containers",
    title: "Storage & Containers",
    imageSrc: "/images/home/category_grid/container_3.jpeg",
    alt: "Storage & Containers",
    href: "/products?category=Warehouse%20%26%20Logistics"
  },
  {
    id: "lifting-handling",
    title: "Lifting & Material Handling",
    imageSrc: "/images/home/category_grid/lifting_3.jpeg",
    alt: "Lifting & Material Handling",
    href: "/products?category=Forklift%20Attachments"
  },
  {
    id: "safety-protection",
    title: "Safety & Protection",
    imageSrc: "/images/home/category_grid/safety_3.jpeg",
    alt: "Safety & Protection",
    href: "/products?category=Safety%20Equipment"
  }
];

export function CategoryGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {CATEGORIES.map((item) => (
          <Link key={item.id} href={item.href} className={styles.card}>
            <div className={styles.imageWrapper} data-speed="auto">
              <Image
                src={item.imageSrc}
                alt={item.alt}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={95}
                priority
              />
            </div>
            <div className={styles.gradientOverlay} />
            <h3 className={styles.label}>{item.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
