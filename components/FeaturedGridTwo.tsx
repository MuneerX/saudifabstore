"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./FeaturedGridTwo.module.css";

interface GridItem {
  id: string;
  title: string;
  imageSrc: string;
  alt: string;
  href: string;
}

const ITEMS: GridItem[] = [
  {
    id: "hardware-piping",
    title: "Hardware & Piping",
    imageSrc: "/images/home/category_grid/pipe4.jpeg",
    alt: "Hardware & Piping",
    href: "/products?category=Hardware%20%26%20Piping"
  },
  {
    id: "safety-chemical",
    title: "Safety & Chemical",
    imageSrc: "/images/home/category_grid/chemical3.jpeg",
    alt: "Safety & Chemical",
    href: "/products?category=Safety%20%26%20Chemical"
  }
];

export function FeaturedGridTwo() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {ITEMS.map((item) => (
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
