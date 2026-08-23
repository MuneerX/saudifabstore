'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import styles from './CategoryGrid.module.css';

interface CategoryItem {
  id: string;
  name: string;
  count: string;
  image: string;
  href: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-forklifts',
    name: 'Forklift Attachments & Jibs',
    count: '24 Items',
    image: '/uploads/3ea54b4f-1709-49b3-be9c-1b4302dc01e9.jpg',
    href: '/products?category=Forklift+Attachments',
  },
  {
    id: 'cat-skips',
    name: 'Self-Dumping Skips & Hoppers',
    count: '18 Items',
    image: '/uploads/1eecdedc-cd94-4183-ab5b-3010a00e0ef1.png',
    href: '/products?category=Warehouse+%26+Logistics',
  },
  {
    id: 'cat-lifting',
    name: 'Crane Material Baskets & Slings',
    count: '15 Items',
    image: '/uploads/623d033a-0f03-412a-b56a-2285f722a810.png',
    href: '/products?category=Lifting+Equipment',
  },
  {
    id: 'cat-spill',
    name: 'Secondary Oil Spill Containment',
    count: '12 Items',
    image: '/uploads/49dc8447-7b24-4eaf-b051-7700b2145207.png',
    href: '/products?category=Safety+%26+Chemical',
  },
  {
    id: 'cat-safety',
    name: 'High-Vis Safety Bollards & Posts',
    count: '30 Items',
    image: '/images/home/category_grid/safety_3.jpeg',
    href: '/products?category=Safety+Equipment',
  },
  {
    id: 'cat-piping',
    name: 'Heavy Rig Pipe Clamps & Hardware',
    count: '42 Items',
    image: '/uploads/ebf4945d-a426-4772-bd50-f897ed90ac8b.png',
    href: '/products?category=Hardware+%26+Piping',
  },
];

export function CategoryGrid() {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Product categories</h2>
          <p className={styles.sectionSub}>Explore specialized industrial machinery &amp; fabricated equipment</p>
        </div>

        <div className={styles.navigationControls}>
          <button 
            type="button" 
            onClick={() => handleScroll('left')} 
            className={styles.navBtn} 
            aria-label="Previous categories"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            type="button" 
            onClick={() => handleScroll('right')} 
            className={styles.navBtn} 
            aria-label="Next categories"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={trackRef} className={styles.sliderTrack}>
        {CATEGORIES.map((cat) => (
          <Link key={cat.id} href={cat.href} className={styles.categoryCard}>
            <div className={styles.imageBox}>
              <Image 
                src={cat.image} 
                alt={cat.name} 
                width={220} 
                height={160} 
                className={styles.catImage}
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.catName}>{cat.name}</h3>
              <span className={styles.catCount}>{cat.count}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
