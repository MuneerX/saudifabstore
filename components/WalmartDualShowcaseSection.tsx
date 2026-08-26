'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SaudiRiyalIcon } from '@hugeicons/core-free-icons';
import styles from './WalmartDualShowcaseSection.module.css';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';
import { useCartContext } from './CartContext';
import { useProducts } from '@/lib/hooks/useProducts';
import { getDynamicBadge, calculateCatalogStats } from '@/lib/utils/badgeHelper';

export function WalmartDualShowcaseSection() {
  const topLeftTrackRef = useRef<HTMLDivElement>(null);
  const bottomRightTrackRef = useRef<HTMLDivElement>(null);

  const scrollTrack = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const { products: liveProducts } = useProducts(true);
  const products = liveProducts && liveProducts.length > 0 ? liveProducts : INITIAL_PRODUCTS;
  const catalogStats = calculateCatalogStats(products);

  const getProduct = (id: string, fallbackIdx: number) => {
    return products.find((p: any) => String(p._id) === id) || products[fallbackIdx] || products[0];
  };

  // Distinct Category 1: Hardware & Heavy Piping / Rigging
  const topLeftProducts = [
    getProduct('prod-12', 11),
    getProduct('prod-10', 9),
    getProduct('prod-15', 14),
  ];

  // Distinct Category 2: Emergency Chemical Safety & Spill Containment
  const bottomRightProducts = [
    getProduct('prod-11', 10),
    getProduct('prod-14', 13),
    getProduct('prod-8', 7),
  ];

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

  const renderProductCard = (product: any, idx: number) => {
    const isLiked = likedMap[product._id];
    const hasOptions = Boolean(product.hasMultipleOptions);
    const badgeConfig = getDynamicBadge(product, styles, catalogStats);

    return (
      <div key={product._id} className={styles.walmartProductCard}>
        {/* Product Image Box Frame */}
        <div className={styles.imgBox}>
          {badgeConfig && (
            <span className={`${styles.clearanceBadge} ${badgeConfig.styleClass}`}>
              {badgeConfig.text}
            </span>
          )}

          <Link href={`/products/${product._id}`} className={styles.imgAnchor}>
            <Image
              src={product.images && product.images[0] ? product.images[0] : '/images/logo.png'}
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
          {!hasOptions ? (
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
  };

  return (
    <section className={styles.dualSection} aria-label="Dual Category & Product Showcase">
      <div className={styles.dualGrid}>
        
        {/* QUADRANT 1: Top-Left Product Row (Hardware & Rigging) */}
        <div className={styles.quadrantBox}>
          <div className={styles.rowHeader}>
            <div className={styles.rowTitleGroup}>
              <h2 className={styles.mainTitle}>Precision Heavy Rigging &amp; Pipe Clamps</h2>
              <span className={styles.subTitle}>ASME B31.3 high-pressure pipe clamps &amp; NDT certified baskets.</span>
            </div>
            <Link href="/products?category=Hardware+%26+Piping" className={styles.viewAllLink}>
              View all
            </Link>
          </div>

          <div className={styles.trackWrapper}>
            <button
              type="button"
              className={`${styles.scrollNavBtn} ${styles.leftNavBtn}`}
              onClick={() => scrollTrack(topLeftTrackRef, 'left')}
              title="Previous items"
              aria-label="Previous items"
            >
              <ChevronLeft size={18} />
            </button>

            <div ref={topLeftTrackRef} className={styles.miniTrack}>
              {topLeftProducts.map((product, idx) => renderProductCard(product, idx))}
            </div>

            <button
              type="button"
              className={`${styles.scrollNavBtn} ${styles.rightNavBtn}`}
              onClick={() => scrollTrack(topLeftTrackRef, 'right')}
              title="Next items"
              aria-label="Next items"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* QUADRANT 2: Top-Right Feature Banner Card (Rigging & Hardware) */}
        <div className={styles.topRightBannerCard}>
          <Image
            src="/images/home/category_grid/showcase1_2.jpeg"
            alt="Rigging & Hardware Showcase"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={styles.bgImage}
            priority
          />
          <div className={styles.bannerContent}>
            <div>
              <span className={styles.eyebrowBlue}>Rigging &amp; Piping Hardware</span>
              <h2 className={styles.bannerMainTitle}>
                Industrial High-Pressure Pipe Clamps &amp; Crane Baskets
              </h2>
              <Link href="/products?category=Hardware+%26+Piping" className={styles.shopNowWhiteBtn}>
                Shop now
              </Link>
            </div>
          </div>
        </div>

        {/* QUADRANT 3: Bottom-Left Feature Banner Card (Chemical & Safety) */}
        <div className={styles.bottomLeftBannerCard}>
          <Image
            src="/images/home/category_grid/showcase2_2.jpeg"
            alt="ANSI Emergency Eyewash Stations & Environmental Spill Sumps"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={styles.bgImage}
          />
          <div className={styles.bannerContent}>
            <div>
              <h2 className={styles.landscapeTitle}>
                ANSI Emergency Eyewash Stations &amp; Environmental Spill Sumps
              </h2>
              <Link href="/products?category=Safety+%26+Chemical" className={styles.shopNowWhiteBtn}>
                Shop now
              </Link>
            </div>
          </div>
        </div>

        {/* QUADRANT 4: Bottom-Right Product Row (Chemical Safety & Spill Control) */}
        <div className={styles.quadrantBox}>
          <div className={styles.rowHeader}>
            <div className={styles.rowTitleGroup}>
              <h2 className={styles.mainTitle}>Emergency Chemical Safety &amp; Spill Sumps</h2>
              <span className={styles.subTitle}>ANSI Z358.1 emergency showers &amp; EPA compliant spill pallets.</span>
            </div>
            <Link href="/products?category=Safety+%26+Chemical" className={styles.viewAllLink}>
              View all
            </Link>
          </div>

          <div className={styles.trackWrapper}>
            <button
              type="button"
              className={`${styles.scrollNavBtn} ${styles.leftNavBtn}`}
              onClick={() => scrollTrack(bottomRightTrackRef, 'left')}
              title="Previous items"
              aria-label="Previous items"
            >
              <ChevronLeft size={18} />
            </button>

            <div ref={bottomRightTrackRef} className={styles.miniTrack}>
              {bottomRightProducts.map((product, idx) => renderProductCard(product, idx))}
            </div>

            <button
              type="button"
              className={`${styles.scrollNavBtn} ${styles.rightNavBtn}`}
              onClick={() => scrollTrack(bottomRightTrackRef, 'right')}
              title="Next items"
              aria-label="Next items"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
