"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Search01Icon, 
  Location01Icon, 
  ShoppingCart01Icon, 
  Menu01Icon, 
  ArrowDown01Icon, 
  ShoppingBagFavoriteIcon, 
  UserSquareIcon, 
  Cancel01Icon, 
  DeliveryTruck01Icon, 
  Store01Icon, 
  PackageIcon, 
  Grid02Icon, 
  Wrench01Icon, 
  ShieldCheckIcon,
  Call02Icon,
  CubeIcon
} from "@hugeicons/core-free-icons";
import styles from "./Navbar.module.css";
import { useCartContext } from "./CartContext";

interface NavbarProps {
  hasBorder?: boolean;
  isLight?: boolean;
  showMarquee?: boolean;
  children?: React.ReactNode;
}

function Icon({ icon, size = 20, strokeWidth = 1.8, className = "" }: { icon: any; size?: number; strokeWidth?: number; className?: string }) {
  const iconData = Array.isArray(icon) ? icon : (icon?.default || icon || []);
  if (!Array.isArray(iconData) || iconData.length === 0) return null;
  return <HugeiconsIcon icon={iconData} size={size} strokeWidth={strokeWidth} className={className} />;
}

function NavbarContent(props: NavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams ? (searchParams.get("search") || searchParams.get("q") || "") : "";

  const { data: session } = useSession();
  const { cart } = useCartContext();
  
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">("delivery");
  const [currentPostalCode, setCurrentPostalCode] = useState("Dammam, 31952");

  const deptsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart?.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
  const cartTotalPrice = cart?.items?.reduce((sum: number, item: any) => {
    const price = item.product?.price ?? item.price ?? 0;
    return sum + (price * (item.quantity || 1));
  }, 0) || 0;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deptsRef.current && !deptsRef.current.contains(event.target as Node)) {
        setIsDepartmentsOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <header className={styles.walmartHeaderContainer}>
      {/* PRIMARY TOP NAV BAR (Walmart Signature Blue #0071DC) */}
      <div className={styles.topHeaderBar}>
        
        {/* Mobile Menu Toggle */}
        <button 
          type="button" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className={styles.mobileHamburgerBtn}
          aria-label="Toggle navigation menu"
        >
          <Icon icon={Menu01Icon} size={22} />
        </button>

        {/* Brand Logo */}
        <Link href="/" className={styles.logoBox}>
          <div className={styles.logoWrapper}>
            <Image
              src="/images/logo.png"
              alt="Saudi Fab Store Logo"
              width={145}
              height={36}
              className={styles.brandLogoImg}
              priority
            />
          </div>
        </Link>

        {/* Pickup or Delivery Pill Button */}
        <div className={styles.locationPillWrapper} ref={locationRef}>
          <button 
            type="button"
            className={styles.deliverToPillBtn}
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            aria-expanded={isLocationDropdownOpen}
          >
            <div className={styles.handIconBadge}>
              <Icon icon={DeliveryTruck01Icon} size={16} className={styles.truckIcon} />
            </div>
            <div className={styles.deliverTextGroup}>
              <div className={styles.deliverTitleRow}>
                <span className={styles.deliverTitle}>
                  Direct site delivery
                </span>
                <Icon icon={ArrowDown01Icon} size={14} className={styles.pillChevron} />
              </div>
              <span className={styles.deliverSub}>{currentPostalCode}</span>
            </div>
          </button>

          {/* Fulfillment Dropdown Modal */}
          {isLocationDropdownOpen && (
            <div className={styles.fulfillmentDropdownCard}>
              <div className={styles.dropdownHeader}>
                <h3>How do you want your item?</h3>
                <button type="button" onClick={() => setIsLocationDropdownOpen(false)} className={styles.closeBtn}>
                  <Icon icon={Cancel01Icon} size={16} />
                </button>
              </div>

              <div className={styles.fulfillmentOptionsGrid}>
                <button 
                  type="button"
                  className={`${styles.optionCard} ${styles.optionActive}`}
                  onClick={() => setFulfillmentType("delivery")}
                >
                  <Icon icon={DeliveryTruck01Icon} size={24} className={styles.optionIcon} />
                  <span className={styles.optionLabel}>Shipping &amp; Delivery</span>
                  <span className={styles.optionSub}>Direct to your site</span>
                </button>

                <button 
                  type="button"
                  className={styles.optionCard}
                  disabled={true}
                  style={{ opacity: 0.4, cursor: "not-allowed", pointerEvents: "none", backgroundColor: "#f8fafc" }}
                >
                  <Icon icon={Store01Icon} size={24} className={styles.optionIcon} style={{ color: "#94a3b8" }} />
                  <span className={styles.optionLabel} style={{ color: "#94a3b8" }}>Store Pickup</span>
                  <span className={styles.optionSub} style={{ color: "#94a3b8" }}>Unavailable</span>
                </button>
              </div>

              <div className={styles.postalCodeSection}>
                <label htmlFor="locationSelect">Location / City:</label>
                <div className={styles.postalInputRow}>
                  <Icon icon={Location01Icon} size={16} className={styles.inputPinIcon} />
                  <input 
                    id="locationSelect"
                    type="text" 
                    value={currentPostalCode} 
                    onChange={(e) => setCurrentPostalCode(e.target.value)}
                    placeholder="Enter city or postal code"
                  />
                  <button 
                    type="button" 
                    onClick={() => setIsLocationDropdownOpen(false)}
                    className={styles.savePostalBtn}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generic Amazon-Style Search Bar */}
        <form onSubmit={handleSearchSubmit} className={styles.pillSearchBarForm}>
          <input
            type="text"
            placeholder="Search products, steel fabrications, forklift attachments, safety gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.pillSearchInput}
          />
          <button type="submit" className={styles.circularSearchBtn} aria-label="Search">
            <Icon icon={Search01Icon} size={18} className={styles.searchMagnifierIcon} />
          </button>
        </form>

        {/* Right Navigation Controls */}
        <div className={styles.rightNavControls}>
          
          {/* Reorder / My Items */}
          <Link href="/reorder" className={styles.navActionBox} title="Reorder My Items">
            <Icon icon={ShoppingBagFavoriteIcon} size={20} className={styles.navActionIcon} />
            <div className={styles.actionTextStack}>
              <span className={styles.actionSubText}>Reorder</span>
              <span className={styles.actionMainText}>My Items</span>
            </div>
          </Link>

          {/* User Sign In / Account */}
          <Link href={session?.user ? "/profile" : "/login"} className={styles.navActionBox}>
            <Icon icon={UserSquareIcon} size={20} className={styles.navActionIcon} />
            <div className={styles.actionTextStack}>
              <span className={styles.actionSubText}>
                {session?.user ? `Hello, ${session.user.name?.split(" ")[0] || 'User'}` : 'Sign In'}
              </span>
              <span className={styles.actionMainText}>Account</span>
            </div>
          </Link>

          {/* Cart Icon & Total Price */}
          <Link href="/cart" className={styles.cartActionBtn} aria-label="Shopping Cart">
            <div className={styles.cartIconBadgeWrapper}>
              <Icon icon={ShoppingCart01Icon} size={24} className={styles.walmartCartIcon} />
              {cartItemCount > 0 && (
                <span className={styles.walmartCartBadge}>{cartItemCount}</span>
              )}
            </div>
            <div className={styles.cartPriceStack}>
              <span className={styles.cartPriceLabel}>
                SAR {cartTotalPrice.toFixed(2)}
              </span>
            </div>
          </Link>

        </div>
      </div>

      {/* SECONDARY SUB-HEADER BAR (Ice Blue #E6F1FC) */}
      <div className={styles.subHeaderNav}>
        <div className={styles.subHeaderInner}>
          
          {/* Shop All Link Pill */}
          <Link href="/products" className={styles.whitePillBtn}>
            <Icon icon={Store01Icon} size={16} />
            <span>Shop All</span>
          </Link>

          {/* Request a Quote Button */}
          <Link href="/contact" className={styles.whitePillBtn}>
            <Icon icon={Call02Icon} size={16} />
            <span>Request a Quote</span>
          </Link>

          {/* Divider Line */}
          <div className={styles.subBarDivider}></div>

          {/* Scrollable Quick Category Chip Pills Track */}
          <div className={styles.categoryChipsTrack}>
            <Link href="/products?category=Forklift+Attachments" className={styles.chipPill}>Forklift Accessories</Link>
            <Link href="/products?category=Warehouse+%26+Logistics" className={styles.chipPill}>Warehouse Equipment</Link>
            <Link href="/products?category=Safety+Equipment" className={styles.chipPill}>Safety &amp; PPE</Link>
            <Link href="/products?badge=BESTSELLER" className={styles.chipPill}>Lifting &amp; Cranes</Link>
            <Link href="/products?sort=newest" className={styles.chipPill}>New Arrivals</Link>
            <Link href="/products?subscription=true" className={styles.chipPill}>B2B Wholesale</Link>
            <Link href="/contact" className={styles.chipPill}>
              <Icon icon={Call02Icon} size={13} />
              <span>Customer Service</span>
            </Link>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className={styles.mobileDrawerOverlay} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={styles.mobileDrawerContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileDrawerHeader}>
              <div className={styles.mobileUserBadge}>
                <Icon icon={UserSquareIcon} size={24} />
                <span>{session?.user ? `Hello, ${session.user.name}` : 'Sign In / Register'}</span>
              </div>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className={styles.closeDrawerBtn}>
                <Icon icon={Cancel01Icon} size={20} />
              </button>
            </div>

            <div className={styles.mobileDrawerBody}>
              <div className={styles.mobileNavSection}>
                <h4>Shop &amp; Catalog</h4>
                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>Shop All Products</Link>
                <Link href="/products?sort=popular" onClick={() => setIsMobileMenuOpen(false)}>Best Sellers &amp; Deals</Link>
                <Link href="/products?sort=newest" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link>
              </div>

              <div className={styles.mobileNavSection}>
                <h4>Account &amp; Support</h4>
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                <Link href="/admin/orders" onClick={() => setIsMobileMenuOpen(false)}>Orders &amp; Returns</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Customer Service</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Navbar(props: NavbarProps) {
  return (
    <Suspense fallback={<header className={styles.header} style={{ minHeight: "80px" }} />}>
      <NavbarContent {...props} />
    </Suspense>
  );
}
