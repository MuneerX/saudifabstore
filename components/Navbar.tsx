"use client";

import React from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import styles from "./Navbar.module.css";

const CENTER_LINKS = [
  { label: "Home", href: "#" },
  { label: "Shop", href: "#" },
  { label: "Services", href: "#" },
  { label: "Divisions", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" }
];

interface NavbarProps {
  hasBorder?: boolean;
  children?: React.ReactNode;
}

export function Navbar({ hasBorder = false, children }: NavbarProps) {
  return (
    <nav className={`${styles.navbar} ${hasBorder ? 'border-b border-white/10' : ''}`}>
      {children}
      {/* Left Logo */}
      <div className={styles.logoArea}>
        <Link href="/" className={styles.logoText}>
          Brooq Al Khalij
        </Link>
      </div>

      {/* Center Links (Desktop) */}
      <div className={styles.centerNav}>
        {CENTER_LINKS.map((link) => (
          <Link key={link.label} href={link.href} className={styles.navLink}>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right Links & Actions */}
      <div className={styles.rightNav}>
        <button className={styles.iconBtn} aria-label="Search">
          <Search size={16} />
        </button>
        
        <Link href="#" className={`${styles.navLink} hidden lg:block`}>
          Universe
        </Link>
        <Link href="#" className={`${styles.navLink} hidden lg:block`}>
          Cart<sup style={{ fontSize: '8px', marginLeft: '2px' }}>00</sup>
        </Link>

        {/* Mobile Menu Toggle */}
        <button className={`${styles.iconBtn} ${styles.mobileMenuBtn}`} aria-label="Menu">
          <Menu size={20} />
        </button>
      </div>
    </nav>
  );
}