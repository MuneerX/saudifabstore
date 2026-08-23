'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, Star, Plus } from 'lucide-react';
import styles from './WalmartPopularCarouselSection.module.css';
import { useCartContext } from '@/components/CartContext';

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className={styles.scrollNavBtn}
            onClick={handleScrollLeft}
            title="Previous Items"
            aria-label="Previous Items"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            className={styles.scrollNavBtn}
            onClick={handleScrollRight}
            title="Next Items"
            aria-label="Next Items"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div ref={trackRef} className={styles.carouselTrack}>
        {products.map((product, idx) => {
          const isWishlisted = wishlist.includes(product._id);
          
          // Curated ALL-CAPS badges
          let badgeConfig: { text: string; styleClass: string } | null = null;
          const rawBadge = (product.badge || "").toUpperCase().trim();
          
          if (rawBadge === "BESTSELLER" || rawBadge === "TOP SELLER" || rawBadge === "POPULAR" || idx % 3 === 0) {
            badgeConfig = { text: "BEST SELLER", styleClass: styles.badgeBestSeller };
          } else if (rawBadge === "NEW" || rawBadge === "NEW ARRIVAL" || idx % 4 === 0) {
            badgeConfig = { text: "NEW", styleClass: styles.badgeNew };
          } else if (rawBadge === "LIMITED" || rawBadge === "LIMITED STOCK" || idx % 5 === 0) {
            badgeConfig = { text: "LIMITED STOCK", styleClass: styles.badgeLimited };
          }

          // Extract clean uppercase brand / model name
          const brandModelName = product.name.split(' ')[0] || 'SAUDI FAB';
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
                
                {/* Bold Model / Brand Name */}
                <h3 className={styles.modelBrandName}>
                  <Link href={`/products/${product._id}`} className={styles.modelAnchor}>
                    {brandModelName}
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
                  </div>
                </div>

                {/* Add / Options Pill Button & Wishlist Row */}
                <div className={styles.cardActionButtonsRow}>
                  {idx % 2 === 0 ? (
                    <button
                      type="button"
                      className={styles.addPillBtn}
                      onClick={(e) => handleAddToCart(product._id, e)}
                      title="Add to cart"
                    >
                      <Plus size={15} />
                      <span>Add</span>
                    </button>
                  ) : (
                    <Link 
                      href={`/products/${product._id}`} 
                      className={styles.optionsPillBtn}
                    >
                      <span>Options</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    className={styles.heartIconButton}
                    onClick={(e) => toggleWishlist(product._id, e)}
                    title="Add to wishlist"
                    aria-label="Add to wishlist"
                  >
                    <Heart 
                      size={18} 
                      fill={isWishlisted ? "#cc0052" : "none"} 
                      color={isWishlisted ? "#cc0052" : "#111111"} 
                    />
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
