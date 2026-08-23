'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus, Zap } from 'lucide-react';
import styles from './WalmartDualShowcaseSection.module.css';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';
import { useCartContext } from './CartContext';

export function WalmartDualShowcaseSection() {
  const topLeftProducts = INITIAL_PRODUCTS.slice(0, 3);
  const bottomRightProducts = INITIAL_PRODUCTS.slice(4, 7);

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

  return (
    <section className={styles.dualSection} aria-label="Dual Category & Product Showcase">
      <div className={styles.dualGrid}>
        
        {/* QUADRANT 1: Top-Left Product Row */}
        <div className={styles.quadrantBox}>
          <div className={styles.rowHeader}>
            <div className={styles.rowTitleGroup}>
              <h2 className={styles.mainTitle}>Fabrication Essentials from 49 SAR</h2>
              <span className={styles.subTitle}>Get orders in as fast as an hour. T&amp;C apply.</span>
            </div>
            <Link href="/products" className={styles.viewAllLink}>
              View all
            </Link>
          </div>

          <div className={styles.miniTrack}>
            {topLeftProducts.map((product, idx) => {
              const calculatedPrice = product.price > 0 ? product.price * 4 : 85.68;
              const originalPrice = calculatedPrice * 1.25;
              const isLiked = likedMap[product._id];
              const hasOptions = idx % 2 === 0;

              return (
                <div key={product._id} className={styles.walmartProductCard}>
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
                        src={product.images && product.images[0] ? product.images[0] : '/images/logo.png'}
                        alt={product.name}
                        width={180}
                        height={170}
                        className={styles.productImg}
                      />
                    </Link>
                  </div>

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

                  <h3 className={styles.productTitle}>
                    <Link href={`/products/${product._id}`} className={styles.titleAnchor}>
                      {product.name}
                    </Link>
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* QUADRANT 2: Top-Right Feature Banner Card */}
        <div className={styles.topRightBannerCard}>
          <div>
            <span className={styles.eyebrowBlue}>Get 'em in as fast as an hour*</span>
            <h2 className={styles.bannerMainTitle}>
              Saudi Fab go-tos, from 49 SAR
            </h2>
            <Link href="/products" className={styles.shopNowWhiteBtn}>
              Shop now
            </Link>
          </div>

          {/* Express Pill Badge - Commented out for later use */}
          {/*
          <div className={styles.expressPillBadge}>
            <Zap size={15} fill="#0071dc" color="#0071dc" />
            <span>Express Delivery</span>
          </div>
          */}

          <div className={styles.bannerRightImgBox}>
            <Image
              src="/uploads/3ea54b4f-1709-49b3-be9c-1b4302dc01e9.jpg"
              alt="Saudi Fab Essentials"
              width={220}
              height={220}
              className={styles.bannerRightImg}
            />
          </div>
        </div>

        {/* QUADRANT 3: Bottom-Left Wide Landscape Banner Card */}
        <div className={styles.bottomLeftBannerCard}>
          <div>
            <h2 className={styles.landscapeTitle}>
              Heavy Industrial Steel &amp; Skips
            </h2>
            <Link href="/products?category=Warehouse+%26+Logistics" className={styles.shopNowWhiteBtn}>
              Shop now
            </Link>
          </div>

          <div className={styles.landscapeRightImgBox}>
            <Image
              src="/uploads/49dc8447-7b24-4eaf-b051-7700b2145207.png"
              alt="Heavy Steel Equipment"
              width={240}
              height={240}
              className={styles.bannerRightImg}
            />
          </div>
        </div>

        {/* QUADRANT 4: Bottom-Right Product Row */}
        <div className={styles.quadrantBox}>
          <div className={styles.rowHeader}>
            <div className={styles.rowTitleGroup}>
              <h2 className={styles.mainTitle}>Precision Torquing &amp; Safety Gear</h2>
              <span className={styles.subTitle}>SA 2.5 sandblasting &amp; SASO certified sets.</span>
            </div>
            <Link href="/products" className={styles.viewAllLink}>
              View all
            </Link>
          </div>

          <div className={styles.miniTrack}>
            {bottomRightProducts.map((product, idx) => {
              const calculatedPrice = product.price > 0 ? product.price * 4 : 85.68;
              const originalPrice = calculatedPrice * 1.25;
              const isLiked = likedMap[product._id];
              const hasOptions = idx % 2 === 0;

              return (
                <div key={product._id} className={styles.walmartProductCard}>
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
                        src={product.images && product.images[0] ? product.images[0] : '/images/logo.png'}
                        alt={product.name}
                        width={180}
                        height={170}
                        className={styles.productImg}
                      />
                    </Link>
                  </div>

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

                  <h3 className={styles.productTitle}>
                    <Link href={`/products/${product._id}`} className={styles.titleAnchor}>
                      {product.name}
                    </Link>
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
