"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AboutTermsFooterSection } from "@/components/AboutTermsFooterSection";

import styles from "./page.module.css";
import { useProducts } from "@/lib/hooks/useProducts";
import { INITIAL_PRODUCTS } from "@/lib/data/initialProducts";
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  ChevronLeft,
  ArrowDown,
  Info,
  ShoppingBag, 
  Heart, 
  Star, 
  Check, 
  SlidersHorizontal,
  RotateCcw,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { useCartContext } from "@/components/CartContext";

const QUICK_SAVINGS_ITEMS = [
  { id: "clearance", label: "Clearance", text: "Can't-Miss Clearance", bg: "#FFEA00", color: "#111111" },
  { id: "flash", label: "Flash Deals", text: "Flash Deals", bg: "#FFF59D", color: "#111111" },
  { id: "savings", label: "Extra savings", text: "$-", bg: "#E3F2FD", color: "#0D47A1" },
  { id: "saudi", label: "Saudi Fab Deals", text: "Saudi Deals", bg: "#002D62", color: "#FFFFFF" },
  { id: "b2b", label: "B2B Savings", text: "B2B Deals", bg: "#BBDEFB", color: "#0D47A1" },
  { id: "safety", label: "The Safety Event", text: "Safety Event", bg: "#FCE4EC", color: "#C2185B" },
  { id: "warehouse", label: "Warehouse Deals", text: "Warehouse", bg: "#FFE0B2", color: "#E65100" },
  { id: "forklift", label: "Forklift Savings", text: "Forklift", bg: "#FFF3E0", color: "#E65100" },
  { id: "lifting", label: "Lifting Savings", text: "Lifting", bg: "#F3E5F5", color: "#7B1FA2" },
  { id: "tech", label: "Tech Savings", text: "Tech Deals", bg: "#FFF8E1", color: "#F57F17" },
  { id: "health", label: "Health & Safety", text: "Health & PPE", bg: "#E8F5E9", color: "#2E7D32" },
  { id: "hardware", label: "Hardware Deals", text: "Hardware", bg: "#FFF3E0", color: "#D84315" },
];

const SHOWCASE_CATEGORIES = [
  {
    id: "forklift",
    label: "Forklift & Material Handling",
    category: "Forklift Attachments"
  },
  {
    id: "warehouse",
    label: "Warehouse & Logistics",
    category: "Warehouse & Logistics"
  },
  {
    id: "lifting",
    label: "Hoisting & Lifting Equipment",
    category: "Lifting Equipment"
  },
  {
    id: "barriers",
    label: "Safety & Hazard Protection",
    category: "Safety Equipment"
  },
  {
    id: "hardware",
    label: "Hardware & Structural Supplies",
    category: "Hardware & Piping"
  },
  {
    id: "chemical",
    label: "Safety Cabinets & Chemical",
    category: "Safety & Chemical"
  },
  {
    id: "trolleys",
    label: "Construction & Workshop Trolleys",
    category: "Construction Trolleys"
  },
  {
    id: "mats",
    label: "Floor Mats & Anti-Fatigue",
    category: "Floor Mats"
  },
  {
    id: "lithium",
    label: "Lithium-Ion Battery Safety",
    category: "Lithium-Ion Safety"
  },
  {
    id: "heating",
    label: "Industrial Heating Jackets",
    category: "Industrial Heating Jackets"
  },
  {
    id: "cable",
    label: "Cable & Hose Bridges",
    category: "Cable & Hose Bridges"
  },
  {
    id: "crates",
    label: "Euroboxes & Foldable Crates",
    category: "Plastic Crates"
  },
  {
    id: "workbenches",
    label: "Industrial Workbenches",
    category: "Workbenches"
  },
  {
    id: "waste",
    label: "Waste Containers & Skips",
    category: "Waste Containers"
  },
  {
    id: "conveyors",
    label: "Conveyors & Moving Systems",
    category: "Conveyor"
  },
  {
    id: "rack",
    label: "Pallet Rack & Column Protection",
    category: "Pallet Rack Protection"
  }
];

// Product interface definition
interface ProductItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  rating: number;
  discountPrice?: number;
  badge?: string;
  colors?: string[];
  description?: string;
  surfacePreparation?: string;
}

const SIZE_CHIPS = [
  { label: "0 - 49 cm", count: 31 },
  { label: "50 - 99 cm", count: 47 },
  { label: "100 - 149 cm", count: 16 },
  { label: "150 - 199 cm", count: 6 },
  { label: "200+ cm", count: 3 },
];

const COLOR_OPTIONS = [
  { name: "Charcoal", hex: "#2B2C2C" },
  { name: "Yellow Safety", hex: "#FEEC3C" },
  { name: "Steel Blue", hex: "#0038A8" },
  { name: "Industrial Red", hex: "#DE3121" },
  { name: "Chrome Finish", hex: "#A1A8AD" },
  { name: "Ash Gray", hex: "#B2BEB5" },
];

const CATEGORY_OPTIONS = [
  "Forklift Attachments",
  "Warehouse & Logistics",
  "Safety Equipment",
  "Hardware & Piping",
  "Lifting Equipment",
  "Safety & Chemical",
  "Cable & Hose Bridges",
  "Column & Crash Protection",
  "Construction Trolleys",
  "Conveyor & Moving Systems",
  "Euroboxes & Plastic Crates",
  "Floor Mats & Anti-Fatigue",
  "Formwork Systems",
  "Industrial Heating Jackets",
  "Lithium-Ion Battery Safety",
  "Pallet Rack Protection",
  "Pallet Trucks & Stackers",
  "Safety & Storage Cabinets",
  "Waste Containers & Skips",
  "Industrial Workbenches"
];

const MATERIAL_OPTIONS = [
  "Certified ASTM Steel",
  "Heavy Galvanized",
  "High-Vis Polyurethane",
  "GRP Anti-Slip"
];

function ProductsPage() {
  const { products, loading, fetchProducts } = useProducts() as {
    products: ProductItem[];
    loading: boolean;
    fetchProducts: (params: any) => Promise<any>;
  };
  const searchParams = useSearchParams();
  const { addToCart } = useCartContext();

  const [selectedSizeChip, setSelectedSizeChip] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [onlyTopSellers, setOnlyTopSellers] = useState(false);
  const [onlyPriceOffers, setOnlyPriceOffers] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedSort, setSelectedSort] = useState("Featured");
  const [comparedProducts, setComparedProducts] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Accordion Expand/Collapse States
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    sort: true,
    category: true,
    price: true,
    colour: false,
    material: false,
    topSeller: true,
    priceOffers: true,
  });

  const [isMounted, setIsMounted] = useState(false);
  const savingsTrackRef = useRef<HTMLDivElement>(null);

  const scrollSavingsTrack = (direction: 'left' | 'right') => {
    if (savingsTrackRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      savingsTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryMapping: { [key: string]: string } = {
        'forklift': 'Forklift Attachments',
        'forklift-repair': 'Forklift Attachments',
        'forklift attachments': 'Forklift Attachments',
        'lifting-handling': 'Forklift Attachments',
        'warehouse': 'Warehouse & Logistics',
        'warehouse & logistics': 'Warehouse & Logistics',
        'safety': 'Safety Equipment',
        'safety equipment': 'Safety Equipment',
        'hardware': 'Hardware & Piping',
        'hardware & piping': 'Hardware & Piping',
        'lifting': 'Lifting Equipment',
        'chemical': 'Safety & Chemical'
      };
      const mappedCategory = categoryMapping[categoryParam.toLowerCase()];
      if (mappedCategory) {
        setSelectedTypes([mappedCategory]);
      }
    }
  }, [searchParams]);

  const toggleAccordion = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCompare = (id: string) => {
    setComparedProducts(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddToCart = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(id, 1);
    } catch (err) {
      console.error(err);
    }
  };

  // Base Products List
  const baseProductsList = (products && products.length > 0) ? products : (INITIAL_PRODUCTS as any);
  const searchQuery = searchParams.get('search') || searchParams.get('q') || '';

  // Filter & Sort Logic
  const filteredProducts = baseProductsList.filter((product: any) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = product.name?.toLowerCase().includes(q);
      const matchCat = product.category?.toLowerCase().includes(q);
      if (!matchName && !matchCat) return false;
    }
    if (selectedTypes.length > 0) {
      const matchCat = selectedTypes.some(t => product.category.toLowerCase().includes(t.toLowerCase()));
      if (!matchCat) return false;
    }
    if (product.price < priceRange.min || product.price > priceRange.max) {
      return false;
    }
    if (onlyTopSellers && product.badge !== "BESTSELLER" && product.badge !== "Top seller") {
      return false;
    }
    if (onlyPriceOffers && !product.discountPrice) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === "Price: Low to High") return a.price - b.price;
    if (selectedSort === "Price: High to Low") return b.price - a.price;
    if (selectedSort === "Rating") return (b.rating || 5) - (a.rating || 5);
    return 0;
  });

  const ProductSkeleton = () => (
    <div className={styles.ikeaProductCard}>
      <div className={styles.skeletonFrame} />
      <div className={styles.skeletonText} />
      <div className={styles.skeletonText} style={{ width: '40%' }} />
    </div>
  );

  // Dynamically resolve product image for each category tile from actual products catalog
  const getCategoryThumbnail = (catName: string) => {
    if (!catName) return null;
    const match = baseProductsList.find((p: any) => 
      p.category && p.category.toLowerCase() === catName.toLowerCase()
    ) || baseProductsList.find((p: any) => 
      p.category && p.category.toLowerCase().includes(catName.toLowerCase().split(' ')[0])
    );
    return match?.images?.[0] || null;
  };

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar isLight={true} hasBorder={true} showMarquee={true} />

      <div className={styles.container}>
        
        {/* TOP BREADCRUMBS TRAIL */}
        <nav className={styles.breadcrumbBar} aria-label="Breadcrumb">
          <ol className={styles.breadcrumbList}>
            <li className={styles.breadcrumbItem}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            </li>
            <li className={styles.breadcrumbSeparator}>
              <ChevronRight size={13} />
            </li>
            <li className={styles.breadcrumbItem}>
              {selectedTypes.length > 0 ? (
                <Link href="/products" onClick={() => setSelectedTypes([])} className={styles.breadcrumbLink}>Products</Link>
              ) : (
                <span className={styles.breadcrumbCurrent}>Products</span>
              )}
            </li>
            {selectedTypes.length > 0 && (
              <>
                <li className={styles.breadcrumbSeparator}>
                  <ChevronRight size={13} />
                </li>
                <li className={styles.breadcrumbItem}>
                  <span className={styles.breadcrumbCurrent}>{selectedTypes.join(', ')}</span>
                </li>
              </>
            )}
          </ol>
        </nav>
        
        {/* PROMO HERO BANNER */}
        <div className={styles.rollbackBannerContainer}>
          <div className={styles.rollbackBannerLeft}>
            <div className={styles.textPillBadge}>
              Saudi Fab Contract Supply
            </div>
          </div>
          <div className={styles.rollbackBannerCenter}>
            <h2 className={styles.rollbackHeadline}>1,000s of Heavy Industrial Fabrication Deals, SASO Certified Structural Steel &amp; Site Equipment.</h2>
          </div>
          <div className={styles.rollbackBannerRight}>
            <div className={styles.isoEnlargedBadgeFrame}>
              <Image 
                src="/images/iso.svg" 
                alt="ISO 9001 Certified" 
                width={85} 
                height={85} 
                className={styles.isoEnlargedImg}
              />
            </div>
          </div>
        </div>

        {/* OUR PRODUCT CATEGORIES SHOWCASE TILES */}
        <div className={styles.topCategoryShowcaseSection}>
          <div className={styles.categoryCarouselWrapper}>
            <button 
              type="button"
              className={styles.carouselNavBtn} 
              onClick={() => scrollCategories('left')}
              aria-label="Scroll left categories"
            >
              <ChevronLeft size={18} />
            </button>

            <div className={styles.categoryTilesGrid} ref={categoryScrollRef}>
              {SHOWCASE_CATEGORIES.map((cat) => {
                const isSelected = selectedTypes.includes(cat.category);
                const dynamicImg = getCategoryThumbnail(cat.category);

                return (
                  <div
                    key={cat.id}
                    className={`${styles.categoryTileCard} ${isSelected ? styles.categoryTileActive : ''}`}
                    onClick={() => {
                      setSelectedTypes(prev =>
                        prev.includes(cat.category)
                          ? prev.filter(c => c !== cat.category)
                          : [cat.category]
                      );
                    }}
                  >
                    {dynamicImg ? (
                      <div className={styles.tileImageWrapper}>
                        <Image
                          src={dynamicImg}
                          alt={cat.label}
                          fill
                          className={styles.tileImg}
                          sizes="120px"
                        />
                      </div>
                    ) : (
                      <div className={styles.tileIconCircle}>
                        <ArrowUpRight size={22} />
                      </div>
                    )}

                    <span className={styles.tileLabel}>{cat.label}</span>
                  </div>
                );
              })}
            </div>

            <button 
              type="button"
              className={styles.carouselNavBtn} 
              onClick={() => scrollCategories('right')}
              aria-label="Scroll right categories"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* SHOP PAGE HEADLINE (Positioned Below Categories) */}
        <div className={styles.savingsTitleSection}>
          <h1 className={styles.savingsMainTitle}>
            Saudi Fab Store Products ({isMounted ? sortedProducts.length : INITIAL_PRODUCTS.length}+)
          </h1>
          <span className={styles.savingsSubtitle}>
            Certified SASO &amp; ISO 9001 industrial equipment with verified site specs <Info size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </span>
        </div>

        {/* 1. TOP SIZE / WIDTH CHIPS FILTER BAR */}
        <div className={styles.topSizeFilterSection}>
          <div className={styles.sizeFilterHeader}>Size (Width)</div>
          <div className={styles.sizeChipsRow}>
            {SIZE_CHIPS.map((chip) => {
              const isActive = selectedSizeChip === chip.label;
              return (
                <button
                  key={chip.label}
                  type="button"
                  className={`${styles.sizeChipBtn} ${isActive ? styles.sizeChipActive : ''}`}
                  onClick={() => setSelectedSizeChip(isActive ? null : chip.label)}
                >
                  <span>{chip.label}</span>
                  <span className={styles.chipCount}>({chip.count})</span>
                </button>
              );
            })}
          </div>
          <div className={styles.itemCountLabel}>
            {isMounted ? sortedProducts.length : INITIAL_PRODUCTS.length} items
          </div>
        </div>

        {/* 2. MAIN CATALOG TWO-COLUMN LAYOUT */}
        <div className={styles.catalogMainLayout}>
          
          {/* LEFT SIDEBAR ACCORDION FILTERS */}
          <aside className={styles.leftSidebarFilters}>
            
            {/* Sort Accordion */}
            <div className={styles.accordionItem}>
              <button 
                type="button"
                className={styles.accordionHeader} 
                onClick={() => toggleAccordion('sort')}
              >
                <span>Sort</span>
                {expandedSections.sort ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {expandedSections.sort && (
                <div className={styles.accordionContent}>
                  {["Featured", "Price: Low to High", "Price: High to Low", "Rating"].map(option => (
                    <div 
                      key={option}
                      className={`${styles.filterOptionRow} ${selectedSort === option ? styles.selectedFilterRow : ''}`}
                      onClick={() => setSelectedSort(option)}
                    >
                      <span>{option}</span>
                      {selectedSort === option && <Check size={14} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Accordion */}
            <div className={styles.accordionItem}>
              <button 
                type="button"
                className={styles.accordionHeader} 
                onClick={() => toggleAccordion('category')}
              >
                <span>Category</span>
                {expandedSections.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {expandedSections.category && (
                <div className={styles.accordionContent}>
                  {CATEGORY_OPTIONS.map(cat => {
                    const isSelected = selectedTypes.includes(cat);
                    return (
                      <div 
                        key={cat}
                        className={`${styles.filterOptionRow} ${isSelected ? styles.selectedFilterRow : ''}`}
                        onClick={() => {
                          setSelectedTypes(prev =>
                            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                          );
                        }}
                      >
                        <div className={styles.headerLeftGroup}>
                          <input 
                            type="checkbox" 
                            checked={isSelected} 
                            onChange={() => {}} 
                            className={styles.checkboxInput} 
                          />
                          <span>{cat}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Accordion */}
            <div className={styles.accordionItem}>
              <button 
                type="button"
                className={styles.accordionHeader} 
                onClick={() => toggleAccordion('price')}
              >
                <span>Price</span>
                {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {expandedSections.price && (
                <div className={styles.accordionContent}>
                  <div className={styles.priceInputsRow}>
                    <input 
                      type="number" 
                      placeholder="Min SAR" 
                      value={priceRange.min || ''} 
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                      className={styles.priceInputField} 
                    />
                    <span>-</span>
                    <input 
                      type="number" 
                      placeholder="Max SAR" 
                      value={priceRange.max < 10000 ? priceRange.max : ''} 
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 10000 }))}
                      className={styles.priceInputField} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Colour Accordion */}
            <div className={styles.accordionItem}>
              <button 
                type="button"
                className={styles.accordionHeader} 
                onClick={() => toggleAccordion('colour')}
              >
                <span>Colour</span>
                {expandedSections.colour ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {expandedSections.colour && (
                <div className={styles.accordionContent}>
                  <div className={styles.colorSwatchesGrid}>
                    {COLOR_OPTIONS.map(c => (
                      <div key={c.name} className={styles.colorSwatchBox} title={c.name}>
                        <div className={styles.colorSwatchDot} style={{ backgroundColor: c.hex }} />
                        <span className={styles.colorSwatchName}>{c.name.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Material Accordion */}
            <div className={styles.accordionItem}>
              <button 
                type="button"
                className={styles.accordionHeader} 
                onClick={() => toggleAccordion('material')}
              >
                <span>Material</span>
                {expandedSections.material ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {expandedSections.material && (
                <div className={styles.accordionContent}>
                  {MATERIAL_OPTIONS.map(mat => (
                    <div key={mat} className={styles.filterOptionRow}>
                      <span>{mat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Seller Checkbox Filter */}
            <div className={styles.accordionItem}>
              <div className={styles.accordionHeader} onClick={() => setOnlyTopSellers(!onlyTopSellers)}>
                <div className={styles.headerLeftGroup}>
                  <span>Top seller</span>
                </div>
                <div className={styles.headerLeftGroup}>
                  <span className={styles.headerCountBadge}>23</span>
                  <input 
                    type="checkbox" 
                    checked={onlyTopSellers} 
                    onChange={() => {}} 
                    className={styles.checkboxInput} 
                  />
                </div>
              </div>
            </div>

            {/* Price Offers Checkbox Filter */}
            <div className={styles.accordionItem}>
              <div className={styles.accordionHeader} onClick={() => setOnlyPriceOffers(!onlyPriceOffers)}>
                <div className={styles.headerLeftGroup}>
                  <span>Price offers</span>
                </div>
                <div className={styles.headerLeftGroup}>
                  <span className={styles.headerCountBadge}>61</span>
                  <input 
                    type="checkbox" 
                    checked={onlyPriceOffers} 
                    onChange={() => {}} 
                    className={styles.checkboxInput} 
                  />
                </div>
              </div>
            </div>

            {(selectedTypes.length > 0 || onlyTopSellers || onlyPriceOffers || priceRange.min > 0) && (
              <button 
                type="button" 
                className={styles.clearFiltersBtn}
                onClick={() => {
                  setSelectedTypes([]);
                  setOnlyTopSellers(false);
                  setOnlyPriceOffers(false);
                  setPriceRange({ min: 0, max: 10000 });
                  setSelectedSizeChip(null);
                }}
              >
                Clear all filters
              </button>
            )}

          </aside>

          {/* RIGHT PRODUCT GRID SECTION */}
          <main className={styles.productsSection}>
            <div className={styles.productsGrid}>
              {!isMounted || loading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <ProductSkeleton key={`skeleton-${idx}`} />
                ))
              ) : (
                sortedProducts.map((product, idx) => {
                  const isWishlisted = wishlist.includes(product._id);
                  
                  // Strictly curated ALL-CAPS badges with distinct color styles
                  let badgeConfig: { text: string; styleClass: string } | null = null;
                  const rawBadge = (product.badge || "").toUpperCase().trim();
                  
                  if (rawBadge === "BESTSELLER" || rawBadge === "TOP SELLER" || rawBadge === "POPULAR") {
                    badgeConfig = { text: "BEST SELLER", styleClass: styles.badgeBestSeller };
                  } else if (rawBadge === "NEW" || rawBadge === "NEW ARRIVAL") {
                    badgeConfig = { text: "NEW", styleClass: styles.badgeNew };
                  } else if (rawBadge === "LIMITED" || rawBadge === "LIMITED STOCK") {
                    badgeConfig = { text: "LIMITED STOCK", styleClass: styles.badgeLimited };
                  }

                  // Extract clean uppercase brand / model name
                  const brandModelName = product.name.split(' ')[0] || 'SAUDI FAB';
                  const subDesc = product.description || `${product.name}, ${product.category}`;

                  return (
                    <div key={product._id} className={styles.ikeaProductCard}>
                      
                      {/* Top Header Badge Chip (Replaces Compare) */}
                      <div className={styles.cardHeaderBadgeRow}>
                        {badgeConfig && (
                          <span className={`${styles.topHeaderBadgeChip} ${badgeConfig.styleClass}`}>
                            {badgeConfig.text}
                          </span>
                        )}
                      </div>

                      {/* Image Box Frame */}
                      <Link href={`/products/${product._id}`} className={styles.imageFrameBox}>
                        <Image
                          src={product.images?.[0] || '/images/home/category_grid/container_3.jpeg'}
                          alt={product.name}
                          fill
                          className={styles.productImg}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      </Link>

                      {/* Card Body Area */}
                      <div className={styles.cardBodyArea}>
                        
                        {/* Bold Model / Brand Name */}
                        <h3 className={styles.modelBrandName}>
                          <Link href={`/products/${product._id}`} className={styles.modelAnchor}>
                            {brandModelName}
                          </Link>
                        </h3>

                        {/* Description Subtext */}
                        <p className={styles.subDescriptionText}>
                          {subDesc}
                        </p>

                        {/* Price Section */}
                        <div className={styles.priceSection}>
                          <div className={styles.mainPriceRow}>
                            <span className={styles.currencyPrefix}>SAR</span>
                            <span className={styles.bigPriceDigits}>
                              {product.price.toLocaleString()}
                            </span>
                          </div>

                          {product.discountPrice && (
                            <>
                              <div className={styles.discountSavingsTag}>
                                15% off, save SAR {(product.price * 0.15).toFixed(0)}
                              </div>
                              <div className={styles.strikethroughPriceNote}>
                                Regular price SAR {(product.price * 1.15).toFixed(0)}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Star Rating Row */}
                        <div className={styles.starRatingRow}>
                          <div className={styles.starGroup}>
                            {Array.from({ length: 5 }).map((_, sIdx) => (
                              <Star 
                                key={sIdx} 
                                size={12} 
                                fill={sIdx < (product.rating || 5) ? "#111111" : "#e0e0e0"} 
                                color={sIdx < (product.rating || 5) ? "#111111" : "#e0e0e0"} 
                              />
                            ))}
                          </div>
                          <span className={styles.reviewCountLink}>
                            ({Math.floor((product.price % 300) * 12 + 40)})
                          </span>
                        </div>

                        {/* Add / Options Pill Button & Wishlist Row */}
                        <div className={styles.cardActionButtonsRow}>
                          {idx % 2 === 0 ? (
                            <button
                              type="button"
                              className={styles.addPillBtn}
                              onClick={(e) => handleAddToCart(product._id, e)}
                              title="Add to cart"
                            >
                              <Plus size={15} />
                              <span>Add</span>
                            </button>
                          ) : (
                            <Link 
                              href={`/products/${product._id}`} 
                              className={styles.optionsPillBtn}
                            >
                              <span>Options</span>
                            </Link>
                          )}

                          <button
                            type="button"
                            className={styles.heartIconButton}
                            onClick={(e) => toggleWishlist(product._id, e)}
                            title="Add to wishlist"
                            aria-label="Add to wishlist"
                          >
                            <Heart 
                              size={18} 
                              fill={isWishlisted ? "#cc0052" : "none"} 
                              color={isWishlisted ? "#cc0052" : "#111111"} 
                            />
                          </button>
                        </div>

                        {/* Feature Bullets & Swatch Thumbnails */}
                        <div className={styles.featureBulletsList}>
                          <div className={styles.featureBulletItem}>
                            <Check size={13} className={styles.checkIcon} />
                            <span>Additional options available</span>
                          </div>
                          <div className={styles.featureBulletItem}>
                            <Check size={13} className={styles.checkIcon} />
                            <span>Heavy duty industrial load</span>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })
              )}
            </div>

            {sortedProducts.length === 0 && !loading && (
              <div className={styles.noResults}>
                <p className={styles.noResultsText}>No products match your current filter criteria.</p>
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Bottom About & Terms Section */}
      <AboutTermsFooterSection />

      <Footer />
    </div>
  );
}

export default function ProductsPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Products...</div>}>
      <ProductsPage />
    </Suspense>
  );
}