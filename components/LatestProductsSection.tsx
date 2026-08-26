'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { INITIAL_PRODUCTS, ProductData } from '@/lib/data/initialProducts';
import { sortProductsByNewAndLatest } from '@/lib/utils/badgeHelper';
import styles from './LatestProductsSection.module.css';

interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  products?: ProductData[];
}

export function LatestProductsSection({ 
  title = "Latest products", 
  subtitle = "Newly dispatched industrial equipment & certified fabricated assets",
  products = INITIAL_PRODUCTS
}: ProductShowcaseProps) {
  const sortedProducts = sortProductsByNewAndLatest(products).slice(0, 4);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [compareList, setCompareList] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {subtitle && <p className={styles.sectionSub}>{subtitle}</p>}
        </div>

        <div className={styles.navigationControls}>
          <button type="button" className={styles.navBtn} aria-label="Previous page">
            <ChevronLeft size={18} />
          </button>
          <button type="button" className={styles.navBtn} aria-label="Next page">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className={styles.productGrid}>
        {sortedProducts.map((product) => {
          const isWishlisted = wishlist[product._id];
          const isCompared = compareList[product._id];

          return (
            <div key={product._id} className={styles.productCard}>
              
              {/* Product Image Frame with Wishlist Heart */}
              <div className={styles.imageFrame}>
                <Image 
                  src={product.images[0] || '/images/home/category_grid/warehouse.jpeg'} 
                  alt={product.name} 
                  fill 
                  className={styles.productImg}
                />
                
                <button 
                  type="button"
                  onClick={() => toggleWishlist(product._id)}
                  className={`${styles.heartBtn} ${isWishlisted ? styles.heartActive : ''}`}
                  aria-label="Add to wishlist"
                >
                  <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : '#64748b'} />
                </button>
              </div>

              {/* Card Meta Info */}
              <div className={styles.cardDetails}>
                <span className={styles.brandTag}>Saudi Fab Store</span>
                <h3 className={styles.productName}>
                  <Link href={`/products/${product._id}`} className={styles.titleLink}>
                    {product.name}
                  </Link>
                </h3>
                <p className={styles.productDesc}>{product.description}</p>

                <div className={styles.priceRow}>
                  {product.price > 0 ? (
                    <div className={styles.priceContainer}>
                      <span className={styles.priceAmount}>€{product.price.toFixed(2)}</span>
                      <span className={styles.taxLabel}>Excl. tax</span>
                    </div>
                  ) : (
                    <span className={styles.priceOnRequest}>Price on request</span>
                  )}
                </div>

                {/* Bottom Actions: Compare Checkbox & View Button */}
                <div className={styles.cardFooterActions}>
                  <label className={styles.compareCheckboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={!!isCompared}
                      onChange={() => toggleCompare(product._id)}
                      className={styles.checkboxInput}
                    />
                    <span>Compare</span>
                  </label>

                  <Link href={`/products/${product._id}`} className={styles.viewBtn}>
                    View
                  </Link>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
