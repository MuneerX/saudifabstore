"use client";

import React from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import styles from "./Navbar.module.css";

const CENTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Divisions", href: "/divisions" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

interface NavbarProps {
  hasBorder?: boolean;
  isLight?: boolean;
  children?: React.ReactNode;
}

export function Navbar({ hasBorder = false, isLight = false, children }: NavbarProps) {
  return (
    <nav className={`${styles.navbar} ${isLight ? styles.lightNavbar : ''} ${hasBorder ? styles.navBorder : ''}`}>
      {children}
      {/* Left Logo */}
      <div className={styles.logoArea}>
        <Link href="/" className={`${styles.logoText} ${isLight ? styles.lightText : ''}`}>
          Brooq Al Khalij
        </Link>
      </div>

      {/* Center Links (Desktop) */}
      <div className={styles.centerNav}>
        {CENTER_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`${styles.navLink} ${isLight ? styles.lightLink : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right Links & Actions */}
      <div className={styles.rightNav}>
        <button className={`${styles.iconBtn} ${isLight ? styles.lightIconBtn : ''}`} aria-label="Search">
          <Search size={16} />
        </button>
        
        <Link href="/products" className={`${styles.navLink} ${isLight ? styles.lightLink : ''} hidden lg:block`}>
          Universe
        </Link>
        <Link href="/cart" className={`${styles.navLink} ${isLight ? styles.lightLink : ''} hidden lg:block`}>
          Cart<sup style={{ fontSize: '9px', marginLeft: '1px' }}>01</sup>
        </Link>

        {/* Mobile Menu Toggle */}
        <button className={`${styles.iconBtn} ${isLight ? styles.lightIconBtn : ''} ${styles.mobileMenuBtn}`} aria-label="Menu">
          <Menu size={20} />
        </button>
      </div>
    </nav>
  );
}