'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './WalmartHeroGridSection.module.css';

export function WalmartHeroGridSection() {
  return (
    <section className={styles.walmartGridContainer}>
      
      {/* 1. LEFT COLUMN */}
      <div className={styles.leftCol}>
        
        {/* Top Landscape Category Card: Forklift Attachments */}
        <div className={styles.leftTopCard}>
          <div>
            <h3 className={styles.cardTitleLight}>Forklift &amp; Material Handling</h3>
            <Link href="/products?category=Forklift+Attachments" className={styles.cardSubLinkLight}>
              Shop forklift gear &rsaquo;
            </Link>
          </div>
          <Image
            src="/uploads/3ea54b4f-1709-49b3-be9c-1b4302dc01e9.jpg"
            alt="Forklift Attachments"
            width={95}
            height={95}
            className={styles.leftTopImg}
          />
        </div>

        {/* Bottom Feature Category Card: Safety & PPE */}
        <div className={styles.leftBottomCard}>
          <div>
            <h3 className={styles.cardTitleDark}>Site Safety &amp; Crash Protection</h3>
            <Link href="/products?category=Safety+Equipment" className={styles.cardSubLinkDark}>
              Shop safety equipment &rsaquo;
            </Link>
          </div>

          <div className={styles.leftBottomImgContainer}>
            <Image
              src="/uploads/5ae305c6-2e82-4e4d-9293-6231391b1f2b.png"
              alt="Safety Equipment"
              fill
              className={styles.leftBottomImg}
              sizes="200px"
            />
          </div>

          <div>
            <span className={styles.priceTagSub}>From</span>
            <p className={styles.priceTagText}>150 SAR</p>
          </div>
        </div>

      </div>

      {/* 2. CENTER COLUMN */}
      <div className={styles.centerCol}>
        
        {/* Main Center Featured Category Hero Card: Warehouse & Logistics */}
        <div className={styles.centerHeroCard}>
          <div className={styles.heroContentLeft}>
            <span className={styles.heroEyebrow}>Featured Industrial Category</span>
            <h2 className={styles.heroTitle}>Warehouse &amp; Heavy Logistics Systems</h2>
            <Link href="/products?category=Warehouse+%26+Logistics" className={styles.heroShopPillBtn}>
              Explore Category
            </Link>
          </div>

          <div className={styles.heroRightImgContainer}>
            <Image
              src="/uploads/49dc8447-7b24-4eaf-b051-7700b2145207.png"
              alt="Warehouse Systems"
              fill
              className={styles.heroRightImg}
              sizes="220px"
            />
          </div>

          <div className={styles.heroBadgeBottom}>
            Top B2B Category
          </div>
        </div>

        {/* Bottom Split Row (2 equal width Category cards side-by-side) */}
        <div className={styles.centerBottomRow}>
          
          {/* Card A: Hoisting & Lifting Equipment */}
          <div className={styles.centerBottomCardA}>
            <div>
              <h3 className={styles.cardTitleDark}>Hoisting &amp; Lifting Equipment</h3>
              <Link href="/products?category=Lifting+Equipment" className={styles.cardSubLinkDark}>
                Shop lifting gear &rsaquo;
              </Link>
            </div>

            <div>
              <span className={styles.priceTagSub}>From</span>
              <p className={styles.priceTagText}>450 SAR</p>
            </div>

            <Image
              src="/uploads/1f68fdc3-06f4-4406-9001-92e3112c0a69.png"
              alt="Lifting Equipment"
              width={110}
              height={110}
              className={styles.splitImgBox}
            />
          </div>

          {/* Card B: Hardware & Structural Steel */}
          <div className={styles.centerBottomCardB}>
            <div>
              <h3 className={styles.cardTitleDark}>Hardware &amp; Structural Steel</h3>
              <Link href="/products?category=Hardware+%26+Piping" className={styles.cardSubLinkDark} style={{ color: '#111111' }}>
                Shop hardware &rsaquo;
              </Link>
            </div>

            <span className={styles.flashDealsPill}>Bestsellers</span>

            <Image
              src="/uploads/1eecdedc-cd94-4183-ab5b-3010a00e0ef1.png"
              alt="Hardware & Steel"
              width={110}
              height={110}
              className={styles.splitImgBox}
            />
          </div>

        </div>

      </div>

      {/* 3. RIGHT COLUMN */}
      <div className={styles.rightCol}>
        
        {/* Top Category Card: Safety Cabinets & Chemical */}
        <div className={styles.rightCardTop}>
          <div>
            <h3 className={styles.cardTitleDark} style={{ fontSize: '18px' }}>Safety Cabinets &amp; Chemical Storage</h3>
            <Link href="/products?category=Safety+%26+Chemical" className={styles.cardSubLinkDark}>
              Browse cabinets &rsaquo;
            </Link>
          </div>
          <Image
            src="/uploads/3ea54b4f-1709-49b3-be9c-1b4302dc01e9.jpg"
            alt="Safety Cabinets"
            width={90}
            height={90}
            className={styles.miniRightImg}
          />
        </div>

        {/* Middle Category Card: Euroboxes & Plastic Crates */}
        <div className={styles.rightCardMiddle}>
          <div>
            <h3 className={styles.cardTitleDark} style={{ fontSize: '18px', color: '#1e3a8a' }}>
              Euroboxes &amp; Plastic Crates
            </h3>
            <Link href="/products?category=Plastic+Crates" className={styles.cardSubLinkDark}>
              Browse crates &rsaquo;
            </Link>
          </div>
          <div className={styles.badgeCircleGreen}>
            ISO 9001
          </div>
          <Image
            src="/uploads/5ae305c6-2e82-4e4d-9293-6231391b1f2b.png"
            alt="Euroboxes"
            width={90}
            height={90}
            className={styles.miniRightImg}
          />
        </div>

        {/* Bottom Category Card: Industrial Workbenches */}
        <div className={styles.rightCardBottom}>
          <div>
            <h3 className={styles.cardTitleDark} style={{ fontSize: '18px' }}>
              Industrial Workbenches &amp; Stations
            </h3>
            <Link href="/products?category=Workbenches" className={styles.cardSubLinkDark}>
              Browse workbenches &rsaquo;
            </Link>
          </div>
          <Image
            src="/uploads/1f68fdc3-06f4-4406-9001-92e3112c0a69.png"
            alt="Workbenches"
            width={90}
            height={90}
            className={styles.miniRightImg}
          />
        </div>

      </div>

    </section>
  );
}
