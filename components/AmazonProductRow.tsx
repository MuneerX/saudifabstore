'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart, Plus } from 'lucide-react';
import { INITIAL_PRODUCTS, ProductData } from '@/lib/data/initialProducts';
import styles from './AmazonProductRow.module.css';
import { useCartContext } from './CartContext';

interface AmazonProductRowProps {
  title?: string;
  linkText?: string;
  linkHref?: string;
  products?: ProductData[];
  whiteText?: boolean;
}

export function AmazonProductRow({
  title = "Related to items you've viewed",
  linkText = "See all",
  linkHref = "/products",
  products = INITIAL_PRODUCTS,
  whiteText = false
}: AmazonProductRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCartContext();
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const toggleLike = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(productId, 1);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollAmount = direction === 'left' ? -440 : 440;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.walmartRowSection}>
      <div className={styles.rowHeader}>
        <div className={styles.titleGroup}>
          <h2 className={`${styles.rowTitle} ${whiteText ? styles.whiteRowTitle : ''}`}>{title}</h2>
        </div>
        {linkText && (
          <Link href={linkHref} className={`${styles.headerLink} ${whiteText ? styles.whiteHeaderLink : ''}`}>
            {linkText}
          </Link>
        )}
      </div>

      <div className={styles.trackWrapper}>
        <button 
          type="button" 
          onClick={() => scroll('left')} 
          className={`${styles.scrollArrow} ${styles.leftArrow}`}
          aria-label="Previous products"
        >
          <ChevronLeft size={20} />
        </button>

        <div ref={trackRef} className={styles.productTrack}>
          {products.map((product, idx) => {
            const calculatedPrice = product.price > 0 ? product.price * 4 : 85.68;
            const originalPrice = calculatedPrice * 1.25;
            const isLiked = likedMap[product._id];
            const hasOptions = idx % 2 === 0;

            return (
              <div key={product._id} className={styles.walmartProductCard}>
                
                {/* Product Image Box with Floating Badges & Wishlist */}
                <div className={styles.imgBox}>
                  {idx % 3 === 0 ? (
                    <span className={styles.clearanceBadge}>Clearance</span>
                  ) : idx % 4 === 1 ? (
                    <span className={styles.rollbackBadge}>Rollback</span>
                  ) : null}

                  <button 
                    type="button" 
                    onClick={(e) => toggleLike(product._id, e)} 
                    className={styles.heartBtn}
                    aria-label="Add to Wishlist"
                  >
                    <Heart 
                      size={18} 
                      className={isLiked ? styles.heartFilled : styles.heartOutline} 
                    />
                  </button>

                  <Link href={`/products/${product._id}`} className={styles.imgAnchor}>
                    <Image
                      src={product.images[0] || '/images/home/category_grid/container_3.jpeg'}
                      alt={product.name}
                      width={180}
                      height={170}
                      className={styles.productImg}
                    />
                  </Link>
                </div>

                {/* Walmart Action Button (+ Add or Options) */}
                <div className={styles.actionBtnRow}>
                  {hasOptions ? (
                    <Link href={`/products/${product._id}`} className={styles.optionsPillBtn}>
                      Options
                    </Link>
                  ) : (
                    <button 
                      type="button" 
                      onClick={(e) => handleAddToCart(product._id, e)}
                      className={styles.addPillBtn}
                    >
                      <Plus size={15} />
                      <span>Add</span>
                    </button>
                  )}
                </div>

                {/* Price Display (Single Black Price) */}
                <div className={styles.priceContainer}>
                  <div className={styles.priceRow}>
                    {(() => {
                      const [whole, cents] = calculatedPrice.toFixed(2).split('.');
                      return (
                        <span className={styles.superscriptPriceGroup}>
                          <span className={styles.priceCurrencySymbol}>{'\u20C1'}</span>
                          <span className={styles.priceWholeDigits}>{whole}</span>
                          <sup className={styles.priceSupCents}>{cents}</sup>
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Product Title */}
                <h3 className={styles.productTitle}>
                  <Link href={`/products/${product._id}`} className={styles.titleAnchor}>
                    {product.name}
                  </Link>
                </h3>

              </div>
            );
          })}
        </div>

        <button 
          type="button" 
          onClick={() => scroll('right')} 
          className={`${styles.scrollArrow} ${styles.rightArrow}`}
          aria-label="Next products"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}

