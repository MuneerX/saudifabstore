'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { 
  Box, 
  Container, 
  Wrench, 
  ShieldCheck, 
  Layers, 
  Truck, 
  Flame, 
  Anchor, 
  Archive, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  HardHat,
  Cpu
} from 'lucide-react';
import styles from './CategoryQuickNav.module.css';

interface QuickCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
}

const QUICK_CATEGORIES: QuickCategory[] = [
  { id: 'cat-1', name: 'Self-Dumping Containers', icon: <Box size={22} />, href: '/products?category=Warehouse+%26+Logistics' },
  { id: 'cat-2', name: 'Bottom Skip Containers', icon: <Archive size={22} />, href: '/products?category=Warehouse+%26+Logistics' },
  { id: 'cat-3', name: 'Forklift Attachments', icon: <Truck size={22} />, href: '/products?category=Forklift+Attachments' },
  { id: 'cat-4', name: 'Working Platforms', icon: <Layers size={22} />, href: '/products?category=Forklift+Attachments' },
  { id: 'cat-5', name: 'Drum & Barrel Handling', icon: <Sliders size={22} />, href: '/products?category=Warehouse+%26+Logistics' },
  { id: 'cat-6', name: 'Cylinder & Gas Handling', icon: <Flame size={22} />, href: '/products?category=Safety+%26+Chemical' },
  { id: 'cat-7', name: 'Spill Containment', icon: <ShieldCheck size={22} />, href: '/products?category=Safety+%26+Chemical' },
  { id: 'cat-8', name: 'Workshop Cranes & Jibs', icon: <Anchor size={22} />, href: '/products?category=Lifting+Equipment' },
  { id: 'cat-9', name: 'Lifting Tables & Baskets', icon: <Container size={22} />, href: '/products?category=Lifting+Equipment' },
  { id: 'cat-10', name: 'Safety Barriers & Posts', icon: <HardHat size={22} />, href: '/products?category=Safety+Equipment' },
  { id: 'cat-11', name: 'Hardware & Rig Piping', icon: <Wrench size={22} />, href: '/products?category=Hardware+%26+Piping' },
  { id: 'cat-12', name: 'Smart Industrial Systems', icon: <Cpu size={22} />, href: '/products' },
];

export function CategoryQuickNav() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <nav className={styles.navContainer} aria-label="Category Quick Navigation">
      <button 
        type="button"
        onClick={() => scroll('left')} 
        className={`${styles.arrowBtn} ${styles.arrowLeft}`}
        aria-label="Scroll left categories"
      >
        <ChevronLeft size={18} />
      </button>

      <div ref={scrollRef} className={styles.scrollWrapper}>
        <div className={styles.categoryTrack}>
          {QUICK_CATEGORIES.map((cat, idx) => (
            <Link 
              key={cat.id} 
              href={cat.href} 
              className={`${styles.categoryItem} ${idx === 0 ? styles.activeItem : ''}`}
            >
              <span className={styles.iconBox}>{cat.icon}</span>
              <span className={styles.categoryLabel}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <button 
        type="button"
        onClick={() => scroll('right')} 
        className={`${styles.arrowBtn} ${styles.arrowRight}`}
        aria-label="Scroll right categories"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
