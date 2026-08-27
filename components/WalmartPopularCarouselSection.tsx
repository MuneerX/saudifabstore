'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, Star, Plus } from 'lucide-react';
import styles from './WalmartPopularCarouselSection.module.css';
import { useCartContext } from '@/components/CartContext';
import { getDynamicBadge, calculateCatalogStats } from '@/lib/utils/badgeHelper';

interface ProductItem {
  _id: string;
  name: string;
  price: number;
  rating?: number;
  numReviews?: number;
  images?: string[];
  category?: string;
  description?: string;
  badge?: string;
}

interface WalmartPopularCarouselSectionProps {
  title?: string;
  subhead?: string;
  products?: ProductItem[];
}

export function WalmartPopularCarouselSection({
  title = 'Popular items in this category',
  subhead = 'Best selling items that customers love',
  products = []
}: WalmartPopularCarouselSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCartContext();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const catalogStats = calculateCatalogStats(products);

  const handleScrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, 1, 'Standard Spec', 'Industrial Finish');
  };

  if (!products || products.length === 0) return null;

  return (
    <section className={styles.carouselSectionContainer}>
      
      {/* Section Header Row */}
      <div className={styles.sectionHeaderRow}>
        <div className={styles.titleGroup}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.sectionSubhead}>{subhead}</p>
        </div>
      </div>

      {/* Carousel Track & Centered Side Scroll Arrows */}
      <div className={styles.trackWrapper}>
        <button
          type="button"
          className={`${styles.scrollNavBtn} ${styles.leftNavBtn}`}
          onClick={handleScrollLeft}
          title="Previous Items"
          aria-label="Previous Items"
        >
          <ChevronLeft size={20} />
        </button>

        <div ref={trackRef} className={styles.carouselTrack}>
        {products.map((product, idx) => {
          const isWishlisted = wishlist.includes(product._id);
          const badgeConfig = getDynamicBadge(product, styles, catalogStats);

          const hasMultipleOptions = Boolean(
            (product as any).hasMultipleOptions || 
            (product as any).variants?.length > 1 || 
            (product as any).availableFinishes?.length > 1 || 
            (product as any).sizes?.length > 1 ||
            product.category === 'Forklift Attachments' ||
            product.category === 'Structural Steel'
          );

          // Full product title and category subtext
          const subDesc = product.description || `${product.name}, ${product.category || 'Industrial'}`;
          const reviewCount = Math.floor((product.price % 300) * 12 + 40);

          return (
            <div key={product._id} className={styles.productCard}>
              
              {/* Top Header Badge Chip Row */}
              <div className={styles.cardHeaderBadgeRow}>
                {badgeConfig && (
                  <span className={`${styles.topHeaderBadgeChip} ${badgeConfig.styleClass}`}>
                    {badgeConfig.text}
                  </span>
                )}
              </div>

              {/* Image Box Frame */}
              <Link href={`/products/${product._id}`} className={styles.imageFrameBox}>
                <Image
                  src={product.images?.[0] || '/uploads/3ea54b4f-1709-49b3-be9c-1b4302dc01e9.jpg'}
                  alt={product.name}
                  fill
                  className={styles.productImg}
                  sizes="250px"
                  unoptimized
                />
              </Link>

              {/* Card Body Area */}
              <div className={styles.cardBodyArea}>
                
                {/* Full Product Title */}
                <h3 className={styles.modelBrandName}>
                  <Link href={`/products/${product._id}`} className={styles.modelAnchor}>
                    {product.name}
                  </Link>
                </h3>

                {/* Description Subtext */}
                <p className={styles.subDescriptionText}>
                  {subDesc}
                </p>

                {/* Price Section */}
                <div className={styles.priceSection}>
                  <div className={styles.mainPriceRow}>
                    <span className={styles.currencyPrefix}>SAR</span>
                    <span className={styles.bigPriceDigits}>
                      {product.price.toLocaleString()}
                    </span>
                    <sup style={{ fontSize: "14px", fontWeight: "800", color: "#111111", top: "-0.4em" }}>.00</sup>
                  </div>
                </div>

                {/* Add / Options Button Row */}
                <div className={styles.cardActionButtonsRow}>
                  {!hasMultipleOptions ? (
                    <button
                      type="button"
                      className={styles.addPillBtn}
                      onClick={(e) => handleAddToCart(product._id, e)}
                      title="Add to cart"
                    >
                      <Plus size={15} />
                      <span>Add to Cart</span>
                    </button>
                  ) : (
                    <Link 
                      href={`/products/${product._id}`} 
                      className={styles.optionsPillBtn}
                      style={{ textDecoration: 'none' }}
                    >
                      <span>Options</span>
                    </Link>
                  )}
                </div>

              </div>
            </div>
          );
        })}
        </div>

        <button
          type="button"
          className={`${styles.scrollNavBtn} ${styles.rightNavBtn}`}
          onClick={handleScrollRight}
          title="Next Items"
          aria-label="Next Items"
        >
          <ChevronRight size={20} />
        </button>
      </div>

    </section>
  );
}
