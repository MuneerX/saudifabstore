'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart, Plus, Star } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SaudiRiyalIcon } from '@hugeicons/core-free-icons';
import { INITIAL_PRODUCTS, ProductData } from '@/lib/data/initialProducts';
import styles from './AmazonProductRow.module.css';
import { useCartContext } from './CartContext';
import { getDynamicBadge, calculateCatalogStats } from '@/lib/utils/badgeHelper';

interface AmazonProductRowProps {
  title?: string;
  linkText?: string;
  linkHref?: string;
  products?: ProductData[];
  whiteText?: boolean;
  loading?: boolean;
}

export function AmazonProductRow({
  title = "Related to items you've viewed",
  linkText = "See all",
  linkHref = "/products",
  products = INITIAL_PRODUCTS,
  whiteText = false,
  loading = false
}: AmazonProductRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCartContext();
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const catalogStats = calculateCatalogStats(products);

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
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={`skel-${idx}`} className={styles.skeletonCard}>
                <div className={styles.skeletonImgFrame} />
                <div className={styles.skeletonLineTitle} />
                <div className={styles.skeletonLineSub} />
                <div className={styles.skeletonLinePrice} />
              </div>
            ))
          ) : (
            products.map((product, idx) => {
              const isLiked = likedMap[product._id];
              const badgeConfig = getDynamicBadge(product, styles, catalogStats);
              const hasMultipleOptions = Boolean(product.hasMultipleOptions);

            return (
              <div key={product._id} className={styles.walmartProductCard}>
                
                {/* Product Image Box Frame (Container & Image style unchanged) */}
                <div className={styles.imgBox}>
                  {badgeConfig && (
                    <span className={`${styles.clearanceBadge} ${badgeConfig.styleClass}`}>
                      {badgeConfig.text}
                    </span>
                  )}

                  <Link href={`/products/${product._id}`} className={styles.imgAnchor}>
                    <Image
                      src={product.images[0] || '/images/home/category_grid/warehouse.jpeg'}
                      alt={product.name}
                      width={180}
                      height={170}
                      className={styles.productImg}
                    />
                  </Link>
                </div>

                {/* Product Title */}
                <h3 className={styles.productTitle}>
                  <Link href={`/products/${product._id}`} className={styles.titleAnchor}>
                    {product.name}
                  </Link>
                </h3>

                {/* Category Subtext */}
                <p className={styles.subDescriptionText}>
                  {product.category}
                </p>

                {/* Price Display */}
                <div className={styles.priceContainer}>
                  <div className={styles.priceRow}>
                    <span className={styles.superscriptPriceGroup}>
                      <sup className={styles.priceCurrencySymbol}>
                        <HugeiconsIcon icon={SaudiRiyalIcon} size={18} strokeWidth={2.4} />
                      </sup>
                      <span className={styles.priceWholeDigits}>
                        {product.price.toLocaleString()}
                      </span>
                      <sup className={styles.priceSupCents}>.00</sup>
                    </span>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className={styles.cardActionButtonsRow} style={{ width: '100%', marginTop: '12px' }}>
                  {!hasMultipleOptions ? (
                    <button 
                      type="button" 
                      onClick={(e) => handleAddToCart(product._id, e)}
                      className={styles.addPillBtn}
                    >
                      <Plus size={14} />
                      <span>Add to Cart</span>
                    </button>
                  ) : (
                    <Link href={`/products/${product._id}`} className={styles.optionsPillBtn}>
                      Options
                    </Link>
                  )}
                </div>

              </div>
            );
          }))}
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

