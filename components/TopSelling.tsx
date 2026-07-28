"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./TopSelling.module.css"; // Import CSS module
import { usePopularProducts } from "@/lib/hooks/usePopularProducts";

export function TopSelling() {
  const { products, loading } = usePopularProducts(4); // Fetch top 4 popular products

  // Skeleton component for loading state
  const ProductSkeleton = () => (
    <div className={styles.productCard}>
      <div className={styles.productImageContainer}>
        <div className={styles.skeletonImage}></div>
      </div>
      <div className={styles.productInfo}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonRating}></div>
        <div className={styles.skeletonPrice}></div>
      </div>
    </div>
  );

  return (
    <section className={styles.topSellingSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>TOP SELLING</h2>
        <div className={styles.productsGrid}>
          {loading ? (
            // Show skeleton loading cards
            Array.from({ length: 4 }).map((_, index) => (
              <ProductSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            // Show actual products
            (products as unknown as { id: string; images: string[]; name: string; rating: number; price: number; discountPrice?: number }[]).map((product, index) => (
              <Link key={`product-${index}`} href={`/products/${product.id}`} className={styles.productCardLink}>
                <div className={styles.productCard}>
                  <div className={styles.productImageContainer}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={300}
                      height={300}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <div className={styles.productRating}>
                      {/* Placeholder for stars */}
                      <span className={styles.stars}>★★★★☆</span>
                      <span className={styles.ratingText}>{product.rating}/5</span>
                    </div>
                    <div className={styles.productPrice}>
                      {product.discountPrice && product.discountPrice < product.price ? (
                        <>
                          <span className={styles.currentPrice}>₹{product.discountPrice?.toFixed(2)}</span>
                          <span className={styles.originalPrice}>₹{product.price?.toFixed(2)}</span>
                          <span className={styles.discountBadge}>
                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <span className={styles.currentPrice}>₹{product.price?.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className={styles.viewAllContainer}>
          <Link href="/products" className={styles.viewAllButton}>
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}