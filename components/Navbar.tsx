"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Search, Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Navbar.module.css";
import { useCartContext } from "./CartContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CENTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Shop", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

interface ShopProduct {
  name: string;
  image: string;
  href: string;
  buttonLabel: string;
  isConfigure?: boolean;
  subtext: string;
}

interface MegaMenuData {
  type?: "columns" | "products";
  col1Title?: string;
  col1Links?: { label: string; href: string }[];
  popularTitle?: string;
  popularThumbs?: { src: string; alt: string; href: string }[];
  
  col2Title?: string;
  col2Links?: { label: string; href: string }[];
  col2ShopAll?: { label: string; href: string; count: string };

  col3Title?: string;
  col3Links?: { label: string; href: string }[];
  col3ShopAll?: { label: string; href: string; count: string };

  featureCard?: {
    image: string;
    title: string;
    sub: string;
    href: string;
  };

  // Product Showcase Layout properties (Pedestal reference design)
  featuredTitle?: string;
  featuredLinks?: { label: string; href: string }[];
  products?: ShopProduct[];

  bottomBar: {
    label: string;
    href: string;
    count?: string;
  };
}

const MEGA_MENUS: Record<string, MegaMenuData> = {
  Services: {
    type: "columns",
    col1Title: "FEATURED",
    col1Links: [
      { label: "Overview & Certifications", href: "/services" },
      { label: "ISO 9001 & AWS Standards", href: "/services" },
      { label: "Quality Audit Reports", href: "/services" },
      { label: "Custom Scope Calculator", href: "/contact" }
    ],
    popularTitle: "POPULAR RIGHT NOW",
    popularThumbs: [
      { src: "/images/home/services/steel.jpeg", alt: "Steel", href: "/services" },
      { src: "/images/home/services/blasting.jpeg", alt: "Blasting", href: "/services" },
      { src: "/images/home/services/painting2.jpeg", alt: "Painting", href: "/services" },
      { src: "/images/home/services/forkliftrepair.jpeg", alt: "Forklift", href: "/services" }
    ],
    col2Title: "CORE SERVICES",
    col2Links: [
      { label: "Heavy Structural Steel Fabrication", href: "/services" },
      { label: "Sandblasting & Surface Prep (SA 2.5)", href: "/services" },
      { label: "Epoxy & Defensive Coatings", href: "/services" },
      { label: "Forklift Mechanical & Engine Fixes", href: "/services" },
      { label: "ProTorc Hydraulic Bolt Torquing", href: "/services" },
      { label: "Diesel Fire Pump Maintenance", href: "/services" }
    ],
    col2ShopAll: { label: "Shop all Services", href: "/services", count: "16" },

    col3Title: "SPECIALIZED SCOPE",
    col3Links: [
      { label: "Pipe Cold Cutting & Beveling", href: "/services" },
      { label: "On-Site Flange Facing Machining", href: "/services" },
      { label: "Intumescent Structural Fireproofing", href: "/services" },
      { label: "Dry Film Thickness (DFT) Audits", href: "/services" },
      { label: "Non-Destructive Testing (NDT)", href: "/services" },
      { label: "Annual Maintenance Contracts (AMC)", href: "/contact" }
    ],
    col3ShopAll: { label: "Shop all Solutions", href: "/services", count: "53" },

    featureCard: {
      image: "/images/home/services/steel2.jpeg",
      title: "Precision Industrial Coatings",
      sub: "SA 2.5 Grit Blasting & AWS Engineering",
      href: "/services"
    },

    bottomBar: {
      label: "Explore all Brooq Al Khalij Services",
      href: "/services",
      count: "53"
    }
  },

  Shop: {
    type: "products",
    featuredTitle: "FEATURED",
    featuredLinks: [
      { label: "Forklift Attachments", href: "/products" },
      { label: "Warehouse & Logistics", href: "/products" },
      { label: "Safety Equipment", href: "/products" },
      { label: "Hardware & Piping", href: "/products" }
    ],
    products: [
      {
        name: "Forklift Single-Fork Hook",
        image: "/images/home/services/forkliftrepair.jpeg",
        href: "/products/prod-1",
        isConfigure: true,
        buttonLabel: "Configure",
        subtext: "Heavy duty hook"
      },
      {
        name: "Forklift Man Basket",
        image: "/images/home/category_grid/safety_3.jpeg",
        href: "/products/prod-3",
        buttonLabel: "Shop",
        subtext: "OSHA platform"
      },
      {
        name: "Heavy Steel Pallet",
        image: "/images/home/category_grid/container_3.jpeg",
        href: "/products/prod-6",
        buttonLabel: "Shop",
        subtext: "Fully welded"
      },
      {
        name: "Safety Bollard Post",
        image: "/images/home/category_grid/safety_3.jpeg",
        href: "/products/prod-7",
        buttonLabel: "Shop",
        subtext: "High visibility"
      },
      {
        name: "Self-Dumping Hopper",
        image: "/images/home/category_grid/workshop2.jpeg",
        href: "/products/prod-8",
        buttonLabel: "Shop",
        subtext: "Automatic dump"
      }
    ],
    bottomBar: {
      label: "Shop all Brooq Al Khalij Products",
      href: "/products",
      count: "15"
    }
  }
};

interface NavbarProps {
  hasBorder?: boolean;
  isLight?: boolean;
  children?: React.ReactNode;
}

export function Navbar({ hasBorder = false, isLight = false, children }: NavbarProps) {
  const { data: session } = useSession();
  const { cart, openCart } = useCartContext();
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([]);
  const [totalProductCount, setTotalProductCount] = useState<string>("15");

  const cartItemCount = cart?.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Automatically fetch real product images from database to sync with shop dropdown menu
    fetch('/api/products?limit=5')
      .then(res => res.json())
      .then(data => {
        if (data && data.products && data.products.length > 0) {
          const mapped: ShopProduct[] = data.products.map((p: any) => ({
            name: p.name,
            image: (p.images && p.images.length > 0) ? p.images[0] : "/images/home/category_grid/container_3.jpeg",
            href: `/products/${p._id || p.id || p.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            buttonLabel: "Shop",
            subtext: p.category || "Industrial Product"
          }));
          setShopProducts(mapped);
        }
        if (data && data.total) {
          setTotalProductCount(data.total.toString());
        }
      })
      .catch(err => console.error("Failed to sync shop navigation dropdown images:", err));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const currentScrollY = self.scroll();
        
        if (currentScrollY < 50) {
          setVisible(true);
          setIsScrolled(false);
        } else {
          const isScrollingUp = self.direction === -1;
          setVisible(isScrollingUp);
          setIsScrolled(true);
        }
      }
    });

    return () => st.kill();
  }, []);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (MEGA_MENUS[label]) {
      setActiveMenu(label);
    } else {
      setActiveMenu(null);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 120);
  };

  const isNavbarLight = isLight || isScrolled || !!activeMenu;
  const stickyClass = visible ? styles.stickyVisible : styles.stickyHidden;
  const currentMenuData = activeMenu ? MEGA_MENUS[activeMenu] : null;

  return (
    <nav 
      data-speed="fixed"
      className={`${styles.navbar} ${isNavbarLight ? styles.lightNavbar : ''} ${hasBorder ? styles.navBorder : ''} ${stickyClass}`}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Left Logo */}
      <div className={styles.logoArea}>
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Brooq Al Khalij Logo"
            width={150}
            height={36}
            className={styles.logoImg}
            priority
          />
        </Link>
      </div>

      {/* Center Links (Desktop) */}
      <div className={styles.centerNav}>
        {CENTER_LINKS.map((link) => {
          const isActive = activeMenu === link.label;
          let pillStyle = `${styles.navLinkPill} ${isNavbarLight ? styles.lightLinkPill : ''}`;

          if (isActive) {
            pillStyle += ` ${isNavbarLight ? styles.activePillLight : styles.activePillDark}`;
          }

          return (
            <Link
              key={link.label}
              href={link.href}
              className={pillStyle}
              onMouseEnter={() => handleMouseEnter(link.label)}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right Links & Actions */}
      <div className={styles.rightNav}>
        <button className={`${styles.iconBtn} ${isNavbarLight ? styles.lightIconBtn : ''}`} aria-label="Search">
          <Search size={16} />
        </button>
        
        {session?.user ? (
          <Link href="/profile" className={`${styles.navLinkPill} ${isNavbarLight ? styles.lightLinkPill : ''}`}>
            Account
          </Link>
        ) : (
          <Link href="/login" className={`${styles.navLinkPill} ${isNavbarLight ? styles.lightLinkPill : ''}`}>
            Login
          </Link>
        )}
        <button
          type="button"
          onClick={openCart}
          className={`${styles.navLinkPill} ${isNavbarLight ? styles.lightLinkPill : ''} hidden lg:inline-flex`}
          style={{ cursor: 'pointer' }}
        >
          Cart<sup style={{ fontSize: '9px', marginLeft: '1px' }}>{cartItemCount < 10 ? `0${cartItemCount}` : cartItemCount}</sup>
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className={`${styles.iconBtn} ${isNavbarLight ? styles.lightIconBtn : ''} ${styles.mobileMenuBtn}`} 
          aria-label="Menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`${styles.mobileDrawerOverlay} ${isMobileMenuOpen ? styles.drawerOpen : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div className={styles.mobileDrawerContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.mobileNavLinks}>
            {CENTER_LINKS.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{link.label}</span>
                <span className={styles.mobileNavArrow}>→</span>
              </Link>
            ))}
          </div>

          <div className={styles.mobileDrawerActions}>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openCart();
              }}
              className={`${styles.mobileActionBtn} ${styles.mobileActionBtnSecondary}`}
            >
              Cart ({cartItemCount < 10 ? `0${cartItemCount}` : cartItemCount})
            </button>
            {session?.user ? (
              <Link 
                href="/profile" 
                className={`${styles.mobileActionBtn} ${styles.mobileActionBtnPrimary}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Account
              </Link>
            ) : (
              <Link 
                href="/login" 
                className={`${styles.mobileActionBtn} ${styles.mobileActionBtnPrimary}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <div 
        className={`${styles.megaMenuWrapper} ${activeMenu ? styles.menuOpen : ''}`}
        onMouseEnter={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }}
      >
        {currentMenuData && (
          <div className={styles.megaMenuContainer}>
            {currentMenuData.type === "products" ? (
              /* Product Showcase Horizontal Grid Dropdown (Pedestal Shop Reference Layout) */
              <div className={styles.shopMegaMenuInner}>
                {/* Top Row: FEATURED header & Sub-links */}
                <div className={styles.shopTopRow}>
                  <span className={styles.shopHeader}>{currentMenuData.featuredTitle || "FEATURED"}</span>
                  <div className={styles.shopSubLinkGrid}>
                    {currentMenuData.featuredLinks?.map((link, idx) => (
                      <Link key={idx} href={link.href} className={styles.shopSubLink}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 5 Product Cards Horizontal Row */}
                <div className={styles.productGrid}>
                  {(shopProducts.length > 0 ? shopProducts : (currentMenuData.products || [])).map((prod, idx) => (
                    <Link key={idx} href={prod.href} className={styles.productCard}>
                      <div className={styles.productImgWrapper}>
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          unoptimized
                          className={styles.productImg}
                          sizes="200px"
                        />
                      </div>
                      <span className={styles.productTitle}>{prod.name}</span>
                      {prod.isConfigure ? (
                        <span className={styles.configureBtn}>✦ {prod.buttonLabel}</span>
                      ) : (
                        <span className={styles.shopUnderlineLink}>{prod.buttonLabel}</span>
                      )}
                      <span className={styles.productSubtext}>{prod.subtext}</span>
                    </Link>
                  ))}
                </div>

                {/* Bottom Full-Width Bar */}
                <div className={styles.megaMenuBottomBar}>
                  <Link href={currentMenuData.bottomBar.href} className={styles.bottomBarLink}>
                    {currentMenuData.bottomBar.label} <sup>{totalProductCount || currentMenuData.bottomBar.count}</sup>
                  </Link>
                </div>
              </div>
            ) : (
              /* Standard 4-Column Layout (Services & Divisions) */
              <div className={styles.megaMenuInner}>
                {/* Column 1: Featured Links & Popular Right Now */}
                <div className={styles.menuCol}>
                  <span className={styles.colHeader}>{currentMenuData.col1Title}</span>
                  <div className={styles.menuLinkList}>
                    {currentMenuData.col1Links?.map((link, idx) => (
                      <Link key={idx} href={link.href} className={styles.menuLink}>
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {currentMenuData.popularThumbs && (
                    <div className={styles.popularSection}>
                      <span className={styles.popularHeader}>{currentMenuData.popularTitle}</span>
                      <div className={styles.popularThumbGrid}>
                        {currentMenuData.popularThumbs.map((thumb, idx) => (
                          <Link key={idx} href={thumb.href} className={styles.popularThumb} title={thumb.alt}>
                            <Image src={thumb.src} alt={thumb.alt} fill className={styles.thumbImg} sizes="140px" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Column 2: Core Offerings / Categories */}
                <div className={styles.menuCol}>
                  <span className={styles.colHeader}>{currentMenuData.col2Title}</span>
                  <div className={styles.menuLinkList}>
                    {currentMenuData.col2Links?.map((link, idx) => (
                      <Link key={idx} href={link.href} className={styles.menuLink}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  {currentMenuData.col2ShopAll && (
                    <Link href={currentMenuData.col2ShopAll.href} className={styles.shopAllLink}>
                      {currentMenuData.col2ShopAll.label}<sup>{currentMenuData.col2ShopAll.count}</sup>
                    </Link>
                  )}
                </div>

                {/* Column 3: Specialized Scope / Products */}
                <div className={styles.menuCol}>
                  <span className={styles.colHeader}>{currentMenuData.col3Title}</span>
                  <div className={styles.menuLinkList}>
                    {currentMenuData.col3Links?.map((link, idx) => (
                      <Link key={idx} href={link.href} className={styles.menuLink}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  {currentMenuData.col3ShopAll && (
                    <Link href={currentMenuData.col3ShopAll.href} className={styles.shopAllLink}>
                      {currentMenuData.col3ShopAll.label}<sup>{currentMenuData.col3ShopAll.count}</sup>
                    </Link>
                  )}
                </div>

                {/* Column 4: Large Featured Right Card */}
                <div className={styles.menuCol}>
                  {currentMenuData.featureCard && (
                    <Link href={currentMenuData.featureCard.href} className={styles.featureCard}>
                      <Image 
                        src={currentMenuData.featureCard.image} 
                        alt={currentMenuData.featureCard.title}
                        fill
                        className={styles.featureCardImage}
                        sizes="360px"
                      />
                      <div className={styles.featureCardOverlay}>
                        <h4 className={styles.featureCardTitle}>{currentMenuData.featureCard.title}</h4>
                        <p className={styles.featureCardSub}>{currentMenuData.featureCard.sub}</p>
                      </div>
                    </Link>
                  )}
                </div>

                {/* Bottom Bar aligned with overall content left and right margins */}
                <div className={styles.megaMenuBottomBar}>
                  <Link href={currentMenuData.bottomBar.href} className={styles.bottomBarLink}>
                    {currentMenuData.bottomBar.label} {currentMenuData.bottomBar.count && <sup>{currentMenuData.bottomBar.count}</sup>}
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}