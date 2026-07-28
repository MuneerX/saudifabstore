"use client";

import React from "react";
import Image from "next/image";
import styles from "./ProductCategories.module.css"; // Import CSS module

const categories = [
  {
    id: 1,
    name: "For Her",
    description: "Elegant fragrances for women",
    image: "/home/versace-logo.svg",
  },
  {
    id: 2,
    name: "For Him",
    description: "Bold scents for men",
    image: "/home/zara-logo-1 1.svg",
  },
  {
    id: 3,
    name: "Unisex",
    description: "Fragrances for everyone",
    image: "/home/gucci-logo-1 1.svg",
  },
  {
    id: 4,
    name: "Limited Edition",
    description: "Exclusive collections",
    image: "/home/prada-logo-1 1.svg",
  },
];

export function ProductCategories() {
  return (
    <section className={styles.productCategoriesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 className={styles.sectionTitle}>
              Shop by Category
            </h2>
            <p className={styles.sectionDescription}>
              Find the perfect fragrance for any occasion.
            </p>
          </div>
          <button className={styles.viewAllButton}>View All Categories</button>
        </div>
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <div key={category.id} className={styles.categoryCard}>
              <div className={styles.imageWrapper}>
                <Image
                  alt={category.name}
                  className={styles.categoryImage}
                  src={category.image}
                  width={300}
                  height={200}
                />
                <div className={styles.imageOverlay}></div>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{category.name}</h3>
                </div>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.cardDescription}>{category.description}</p>
                <button className={styles.exploreButton}>
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}