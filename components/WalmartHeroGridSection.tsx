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
          <Image
            src="/images/home/category_grid/forklift6.jpeg"
            alt="Forklift Attachments"
            fill
            sizes="310px"
            className={styles.cardBgImg}
          />
          <div className={styles.leftTopOverlay} />
          <div className={styles.cardTextWrapperTop}>
            <h3 className={styles.walmartCardTitleDark}>Forklift &amp; Material Handling</h3>
            <Link href="/products?category=Forklift+Attachments" className={styles.walmartCardLinkDark}>
              Shop forklift gear
            </Link>
          </div>
        </div>

        {/* Bottom Feature Category Card: Safety Cabinets & Chemical Storage */}
        <div className={styles.leftBottomCard}>
          <Image
            src="/images/home/category_grid/cabinet6.jpeg"
            alt="Safety Cabinets"
            fill
            sizes="310px"
            className={styles.cardBgImg}
          />
          <div className={styles.leftBottomOverlay} />
          <div className={styles.cardTextWrapper}>
            <div>
              <h3 className={styles.walmartCardTitleDark}>Safety Cabinets &amp; Chemical Storage</h3>
              <Link href="/products?category=Safety+%26+Chemical" className={styles.walmartCardLinkDark}>
                Learn more
              </Link>
            </div>
            <div className={styles.walmartPriceTag}>
              <span className={styles.walmartPriceSubDark}>From</span>
              <p className={styles.walmartPriceValueDark}>150 SAR</p>
            </div>
          </div>
        </div>

      </div>

      {/* 2. CENTER COLUMN */}
      <div className={styles.centerCol}>
        
        {/* Main Center Featured Category Hero Card: Warehouse & Logistics */}
        <div className={styles.centerHeroCard}>
          <Image
            src="/images/home/category_grid/warehouse6.jpeg"
            alt="Warehouse Systems"
            fill
            sizes="900px"
            className={styles.cardBgImg}
          />
          <div className={styles.centerHeroOverlay} />

          <div className={styles.heroContentLeftWalmart}>
            <span className={styles.heroEyebrowWalmart}>Featured Industrial Category</span>
            <h2 className={styles.heroTitleWalmart}>Warehouse &amp; Heavy Logistics Systems</h2>
            <Link href="/products?category=Warehouse+%26+Logistics" className={styles.heroShopPillBtnWalmart}>
              Explore Category
            </Link>
          </div>
        </div>

        {/* Bottom Split Row (2 equal width Category cards side-by-side) */}
        <div className={styles.centerBottomRow}>
          
          {/* Card A: Hoisting & Lifting Equipment */}
          <div className={styles.centerBottomCardA}>
            <Image
              src="/images/home/category_grid/hoisting6.jpeg"
              alt="Lifting Equipment"
              fill
              sizes="450px"
              className={styles.cardBgImg}
            />
            <div className={styles.centerBottomAOverlay} />
            <div className={styles.cardTextWrapper}>
              <div>
                <h3 className={styles.walmartCardTitleDark}>Hoisting &amp; Lifting Equipment</h3>
                <Link href="/products?category=Lifting+Equipment" className={styles.walmartCardLinkDark}>
                  Shop lifting gear
                </Link>
              </div>

              <div className={styles.walmartPriceTag}>
                <span className={styles.walmartPriceSubDark}>From</span>
                <p className={styles.walmartPriceValueDark}>450 SAR</p>
              </div>
            </div>
          </div>

          {/* Card B: Hardware & Structural Steel */}
          <div className={styles.centerBottomCardB}>
            <Image
              src="/images/home/category_grid/hardware7.jpeg"
              alt="Hardware & Steel"
              fill
              sizes="450px"
              className={styles.cardBgImg}
            />
            <div className={styles.centerBottomBOverlay} />
            <div className={styles.cardTextWrapper}>
              <div>
                <h3 className={styles.walmartCardTitleDark}>Hardware &amp; Structural Steel</h3>
                <Link href="/products?category=Hardware+%26+Piping" className={styles.walmartCardLinkDark}>
                  Shop now
                </Link>
              </div>

              <div className={styles.flashDealsLogoWalmart}>
                Flash<br />Deals
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. RIGHT COLUMN */}
      <div className={styles.rightCol}>
        
        {/* Top Category Card: Site Safety & Crash Protection */}
        <div className={styles.rightCardTop}>
          <Image
            src="/images/home/category_grid/safety6.jpeg"
            alt="Site Safety Equipment"
            fill
            sizes="310px"
            className={styles.cardBgImg}
          />
          <div className={styles.rightTopOverlay} />
          <div className={styles.cardTextWrapperTop}>
            <h3 className={styles.walmartCardTitleDark} style={{ fontSize: '18px' }}>Site Safety &amp; Crash Protection</h3>
            <Link href="/products?category=Safety+Equipment" className={styles.walmartCardLinkDark}>
              Shop now
            </Link>
          </div>
        </div>

        {/* Middle Category Card: Euroboxes & Plastic Crates */}
        <div className={styles.rightCardMiddle}>
          <Image
            src="/images/home/category_grid/eurocrate6.jpeg"
            alt="Euroboxes"
            fill
            sizes="310px"
            className={styles.cardBgImg}
          />
          <div className={styles.rightMiddleOverlay} />
          <div className={styles.cardTextWrapperTop}>
            <h3 className={styles.walmartCardTitleDark} style={{ fontSize: '18px' }}>
              Euroboxes &amp; Plastic Crates
            </h3>
            <Link href="/products?category=Plastic+Crates" className={styles.walmartCardLinkDark}>
              Shop now
            </Link>
          </div>
          <div className={styles.badgeCircleGreen}>
            ISO 9001
          </div>
        </div>

        {/* Bottom Category Card: Industrial Workbenches */}
        <div className={styles.rightCardBottom}>
          <Image
            src="/images/home/category_grid/workbench6.jpeg"
            alt="Workbenches"
            fill
            sizes="310px"
            className={styles.cardBgImg}
          />
          <div className={styles.rightBottomOverlay} />
          <div className={styles.cardTextWrapperTop}>
            <h3 className={styles.walmartCardTitleDark} style={{ fontSize: '18px' }}>
              Industrial Workbenches &amp; Stations
            </h3>
            <Link href="/products?category=Workbenches" className={styles.walmartCardLinkDark}>
              Shop now
            </Link>
          </div>
        </div>

      </div>

    </section>
  );
}
