"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";

import styles from "./page.module.css";
import { useProducts } from "@/lib/hooks/useProducts";
import { INITIAL_PRODUCTS } from "@/lib/data/initialProducts";
import { X } from "lucide-react";

// Define the type for product items
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
  labelType?: string;
}

const FALLBACK_BADGES = ["BESTSELLER", "BESTSELLER", "BESTSELLER", "LIMITED", "NEW"];
const SAMPLE_SWATCH_SETS = [
  { label: "FORKLIFT ATTACHMENTS", colors: ["#78909c", "#b0bec5", "#37474f", "#eb5521"] },
  { label: "WAREHOUSE & LOGISTICS", colors: ["#eb5521", "#ffb300", "#1e3a8a", "#212121"] },
  { label: "SAFETY EQUIPMENT", colors: ["#8d6e63", "#5d4037", "#a1887f"] },
  { label: "HARDWARE & PIPING", colors: ["#eb5521", "#ffd54f", "#263238"] },
];

const COLOR_OPTIONS = [
  { name: "Charcoal", hex: "#2B2C2C" },
  { name: "Yellow Safety", hex: "#FFD54F" },
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
  "Safety & Chemical"
];

function ProductsPage() {
  const { products, loading, fetchProducts } = useProducts() as {
    products: ProductItem[];
    loading: boolean;
    fetchProducts: (params: ProductFetchParams) => Promise<ProductFetchResponse>;
  };
  const searchParams = useSearchParams();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [sliderRef, setSliderRef] = useState<HTMLDivElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Featured");
  const [gridColumns, setGridColumns] = useState<4 | 2>(4);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  interface ProductFetchParams {
    limit?: number;
    category?: string;
    color?: string;
    size?: string;
    minPrice?: number;
    maxPrice?: number;
  }

  interface ProductFetchResponse {
    products: ProductItem[];
    totalPages?: number;
  }

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryMapping: { [key: string]: string } = {
        'forklift': 'Forklift Attachments',
        'warehouse': 'Warehouse & Logistics',
        'safety': 'Safety Equipment',
        'hardware': 'Hardware & Piping',
        'lifting': 'Lifting Equipment',
        'chemical': 'Safety & Chemical'
      };
      const mappedCategory = categoryMapping[categoryParam.toLowerCase()] || categoryParam;
      if (mappedCategory) {
        setSelectedTypes([mappedCategory]);
      }
    }
    setInitialLoadComplete(true);
  }, [searchParams]);

  useEffect(() => {
    if (initialLoadComplete) {
      const params: ProductFetchParams = { limit: 1000 };
      if (selectedTypes.length > 0) params.category = selectedTypes.join(',');
      if (selectedColors.length > 0) params.color = selectedColors.join(',');
      if (selectedSizes.length > 0) params.size = selectedSizes.join(',');
      if (priceRange.min > 0) params.minPrice = priceRange.min;
      if (priceRange.max < 2000) params.maxPrice = priceRange.max;

      fetchProducts(params);
    }
  }, [selectedTypes, selectedColors, selectedSizes, priceRange, fetchProducts, initialLoadComplete]);

  const toggleFilter = () => {
    setIsFilterOpen(prev => !prev);
  };

  const toggleSort = () => {
    setIsSortOpen(prev => !prev);
  };

  const handleSortSelect = (sortOption: string) => {
    setSelectedSort(sortOption);
    setIsSortOpen(false);
  };

  // Determine actual display products list (using fetched products or BR Products catalog)
  const baseProductsList = (products && products.length > 0) ? products : (INITIAL_PRODUCTS as any);

  // Filter & Sort logic for display
  const filteredProducts = baseProductsList.filter((product: any) => {
    if (selectedTypes.length > 0) {
      const matchCat = selectedTypes.some(t => product.category.toLowerCase().includes(t.toLowerCase()));
      if (!matchCat) return false;
    }
    if (product.price < priceRange.min || product.price > priceRange.max) {
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
    <div className={styles.productCard}>
      <div className={styles.productImageContainer}>
        <div className={styles.skeletonImage}></div>
      </div>
      <div className={styles.productMetaInfo}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonPrice}></div>
      </div>
    </div>
  );

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar isLight={true} hasBorder={true} />

      {/* Main Container */}
      <div className={styles.container}>
        
        {/* Top Header Section with Title & Control Cluster */}
        <div className={styles.headerSection}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.pageTitle}>
              Industrial Products & Equipment<sup className={styles.titleBadge}>{isMounted ? sortedProducts.length : INITIAL_PRODUCTS.length}</sup>
            </h1>
          </div>

          <div className={styles.controlCluster}>
            {/* Sort and Filters Action Buttons */}
            <div className={styles.actionButtonsRow}>
              {/* Sort Button & Dropdown */}
              <div className={styles.sortDropdownWrapper}>
                <button className={styles.sortButton} onClick={toggleSort}>
                  <span>Sort</span>
                </button>
                
                {isSortOpen && (
                  <div className={styles.sortMenu}>
                    {["Featured", "Price: Low to High", "Price: High to Low", "Rating"].map((option) => (
                      <button
                        key={option}
                        className={`${styles.sortMenuItem} ${selectedSort === option ? styles.selectedSortItem : ''}`}
                        onClick={() => handleSortSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filters Button */}
              <button className={styles.filtersButton} onClick={toggleFilter}>
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Slide-over Filter Drawer & Backdrop Overlay */}
        {isFilterOpen && (
          <div className={styles.filterOverlay} onClick={toggleFilter} />
        )}
        
        <div className={`${styles.filtersSidebar} ${isFilterOpen ? styles.filtersSidebarOpen : ''}`}>
          <div className={styles.filtersContainer}>
            <div className={styles.filtersHeader}>
              <h2 className={styles.filtersTitle}>Filters</h2>
              <button className={styles.closeFilterButton} onClick={toggleFilter}>
                <X size={16} />
              </button>
            </div>

            <div className={styles.separatorLine} />

            {/* Categories Filter */}
            <div className={styles.filterSection}>
              <h3 className={styles.filterSectionTitle}>Categories</h3>
              <div className={styles.colorsList}>
                {CATEGORY_OPTIONS.map(cat => (
                  <div
                    key={cat}
                    className={`${styles.colorRow} ${selectedTypes.includes(cat) ? styles.colorRowSelected : ''}`}
                    onClick={() => handleTypeChange(cat)}
                  >
                    <span className={styles.colorName}>{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.separatorLine} />

            {/* Colors Section */}
            <div className={styles.filterSection}>
              <h3 className={styles.filterSectionTitle}>Colors & Finish</h3>
              <div className={styles.colorsList}>
                {COLOR_OPTIONS.map(color => (
                  <div
                    key={color.name}
                    className={`${styles.colorRow} ${selectedColors.includes(color.name.toLowerCase()) ? styles.colorRowSelected : ''}`}
                    onClick={() => handleColorChange(color.name.toLowerCase())}
                  >
                    <span
                      className={styles.colorSwatch}
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className={styles.colorName}>{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.separatorLine} />

            <button className={styles.applyFilterButton} onClick={toggleFilter}>
              Apply Filters
            </button>
          </div>
        </div>

        {/* Product Grid Display */}
        <div className={styles.productsSection}>
          <div className={`${styles.productsGrid} ${gridColumns === 2 ? styles.gridTwoCols : styles.gridFourCols}`}>
            {!isMounted || loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={`skeleton-${index}`} />
              ))
            ) : (
              sortedProducts.map((product, idx) => {
                const badge = product.badge || FALLBACK_BADGES[idx % FALLBACK_BADGES.length];
                const swatchSet = SAMPLE_SWATCH_SETS[idx % SAMPLE_SWATCH_SETS.length];

                return (
                  <Link key={product._id} href={`/products/${product._id}`} className={styles.productCardLink}>
                    <div className={styles.productCard}>
                      
                      {/* Gray Image Box */}
                      <div className={styles.productImageContainer}>
                        {badge && (
                          <div className={styles.badgePill}>
                            {badge}
                          </div>
                        )}
                        <Image
                          src={product.images?.[0] || '/images/home/category_grid/container_3.jpeg'}
                          alt={product.name}
                          fill
                          className={`${styles.productImage} ${product.images?.[1] ? styles.primaryImageWithHover : ''}`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        {product.images?.[1] && (
                          <Image
                            src={product.images[1]}
                            alt={`${product.name} Hover View`}
                            fill
                            className={styles.productHoverImage}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        )}
                      </div>

                      {/* Product Details below Image Box */}
                      <div className={styles.productInfoArea}>
                        {/* Title with micro arrow */}
                        <div className={styles.productTitleRow}>
                          <svg className={styles.arrowPrefix} width="10" height="19" viewBox="0 0 10 19" fill="none">
                            <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14384 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
                          </svg>
                          <h3 className={styles.productName}>{product.name}</h3>
                        </div>

                        {/* Price */}
                        <div className={styles.productPriceRow}>
                          <span className={styles.currentPrice}>€{product.price}</span>
                        </div>

                        {/* Category Label */}
                        <div className={styles.swatchSection}>
                          <div className={styles.swatchLabel}>{product.category || swatchSet.label}</div>
                        </div>

                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {sortedProducts.length === 0 && !loading && (
            <div className={styles.noResults}>
              <p className={styles.noResultsText}>No products match your current filters.</p>
            </div>
          )}
        </div>

      </div>

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