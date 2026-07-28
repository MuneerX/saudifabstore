"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";
import { StayUpToDate } from "../../components/StayUpToDate";
import styles from "./page.module.css";
import { useProducts } from "@/lib/hooks/useProducts";


// Define the type for product items
interface ProductItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  // Add other properties if they exist
  rating: number;
  discountPrice?: number;
}

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
  const [priceRange, setPriceRange] = useState({ min: 50, max: 200 });
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [sliderRef, setSliderRef] = useState<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Define interfaces for fetchProducts params and response
  interface ProductFetchParams {
    page: number;
    category?: string;
    color?: string;
    size?: string;
    minPrice?: number;
    maxPrice?: number;
  }

  interface ProductFetchResponse {
    products: ProductItem[];
    totalPages: number;
    // Add other properties if they exist in the API response
  }

  // This effect runs once on initial load to set the category from the URL.
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryMapping: { [key: string]: string } = {
        't-shirts': 't-shirts',
        'hoodies': 'hoodie',
        'shorts': 'shorts',
        'jeans': 'jeans',
        'shoes': 'shirts',
        'accessories': 'shirts'
      };
      const mappedCategory = categoryMapping[categoryParam.toLowerCase()];
      if (mappedCategory) {
        setSelectedTypes([mappedCategory]);
      }
    }
    setInitialLoadComplete(true);
  }, [searchParams, setSelectedTypes]);

  // This effect fetches products whenever filters or the current page change.
  useEffect(() => {
    if (initialLoadComplete) {
      const params: {
        page: number;
        category?: string;
        color?: string;
        size?: string;
        minPrice?: number;
        maxPrice?: number;
      } = { page: currentPage };
      if (selectedTypes.length > 0) params.category = selectedTypes.join(',');
      if (selectedColors.length > 0) params.color = selectedColors.join(',');
      if (selectedSizes.length > 0) params.size = selectedSizes.join(',');
      if (priceRange.min > 50) params.minPrice = priceRange.min;
      if (priceRange.max < 200) params.maxPrice = priceRange.max;

      fetchProducts(params).then(res => {
        if (res) {
          setTotalPages(res.totalPages);
        }
      });
    }
  }, [currentPage, selectedTypes, selectedColors, selectedSizes, priceRange, fetchProducts, initialLoadComplete]);

  const toggleFilter = () => {
    setIsFilterOpen(prev => !prev);
  };
  const filteredProducts = products;

  // Skeleton component for loading state
  const ProductSkeleton = () => (
    <div className={styles.productCard}>
      <div className={styles.productImageContainer}>
        <div className={styles.skeletonImage}></div>
      </div>
      <div className={styles.productInfo}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonRating}></div>
        <div className={styles.skeletonPrice}></div>
      </div>
    </div>
  );

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };


  const handleMouseDown = (handle: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef) return;

    const rect = sliderRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const value = Math.round(percentage * 150 + 50); // 50 to 200 range

    if (isDragging === 'min') {
      setPriceRange(prev => ({
        min: Math.min(value, prev.max - 10),
        max: prev.max
      }));
    } else if (isDragging === 'max') {
      setPriceRange(prev => ({
        min: prev.min,
        max: Math.max(value, prev.min + 10)
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  // Calculate percentage for visual positioning
  const getPercentage = (value: number) => {
    return ((value - 50) / 150) * 100;
  };

  // Global mouse event handlers
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef) return;

      const rect = sliderRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const value = Math.round(percentage * 150 + 50);

      if (isDragging === 'min') {
        setPriceRange(prev => ({
          min: Math.min(value, prev.max - 10),
          max: prev.max
        }));
      } else if (isDragging === 'max') {
        setPriceRange(prev => ({
          min: prev.min,
          max: Math.max(value, prev.min + 10)
        }));
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, sliderRef]);

  return (
    <div className={styles.pageContainer}>
      <Navbar hasBorder={true} />
      
      {/* Breadcrumb Navigation */}
      <div className={styles.breadcrumbSection}>
        <div className={styles.breadcrumbContainer}>
          <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
            <ol className={styles.breadcrumbList}>
              <li className={styles.breadcrumbItem}>
                <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              </li>
              <li className={styles.breadcrumbSeparator} aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </li>
              <li className={styles.breadcrumbItem}>
                <span className={styles.breadcrumbCurrent}>Shop</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.mainContent}>
          {isFilterOpen && <div className={styles.filterOverlay} onClick={toggleFilter}></div>}
          <div className={`${styles.filtersSidebar} ${isFilterOpen ? styles.filtersSidebarOpen : ''}`}>
            <div className={styles.filtersContainer}>
              {/* Filters Header */}
              <div className={styles.filtersHeader}>
                <h2 className={styles.filtersTitle}>Filters</h2>
                <button className={styles.closeFilterButton} onClick={toggleFilter}>
                  &times;
                </button>
              </div>

              <div className={styles.separatorLine}></div>

              {/* T-shirts */}
              <div className={styles.filterSection}>
                <div className={styles.typeFilters}>
                  {['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'].map(type => (
                    <div
                      key={type}
                      className={`${styles.typeFilterItem} ${selectedTypes.includes(type.toLowerCase()) ? styles.selected : ''}`}
                      onClick={() => handleTypeChange(type.toLowerCase())}
                    >
                      <span className={styles.typeFilterText}>{type}</span>
                      <div className={styles.typeFilterArrow}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.separatorLine}></div>

              {/* Price */}
              <div className={styles.filterSection}>
                <div className={styles.filterSectionTitle}>
                  <span>Price</span>
                  <div className={styles.sectionIcon}>
                    <svg width="11.5" height="6.5" viewBox="0 0 11.5 6.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5.75 5.75L10.5 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className={styles.priceRange}>
                  <div className={styles.priceLabels}>
                    <span className={styles.priceLabel}>₹{priceRange.min}</span>
                    <span className={styles.priceLabel}>₹{priceRange.max}</span>
                  </div>
                  <div
                    ref={setSliderRef}
                    className={styles.priceSliderContainer}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <div className={styles.priceSliderTrack}>
                      <div
                        className={styles.priceSliderFill}
                        style={{
                          left: `${getPercentage(priceRange.min)}%`,
                          width: `${getPercentage(priceRange.max) - getPercentage(priceRange.min)}%`
                        }}
                      ></div>
                    </div>
                    <div
                      className={`${styles.priceSliderHandle} ${styles.left}`}
                      style={{ left: `${getPercentage(priceRange.min)}%` }}
                      onMouseDown={handleMouseDown('min')}
                    ></div>
                    <div
                      className={`${styles.priceSliderHandle} ${styles.right}`}
                      style={{ left: `${getPercentage(priceRange.max)}%` }}
                      onMouseDown={handleMouseDown('max')}
                    ></div>
                  </div>
                </div>
              </div>

              <div className={styles.separatorLine}></div>

              {/* Colors */}
              <div className={styles.filterSection}>
                <div className={styles.filterSectionTitle}>
                  <span>Colors</span>
                  <div className={styles.sectionIcon}>
                    <svg width="11.5" height="6.5" viewBox="0 0 11.5 6.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5.75 5.75L10.5 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className={styles.colorsGrid}>
                  <div className={styles.colorsRow}>
                    <div
                      className={`${styles.colorCircle} ${selectedColors.includes('green') ? styles.selected : ''}`}
                      style={{ backgroundColor: '#00c12b' }}
                      onClick={() => handleColorChange('green')}
                    ></div>
                    <div
                      className={`${styles.colorCircle} ${selectedColors.includes('red') ? styles.selected : ''}`}
                      style={{ backgroundColor: '#f60606' }}
                      onClick={() => handleColorChange('red')}
                    ></div>
                    <div
                      className={`${styles.colorCircle} ${selectedColors.includes('yellow') ? styles.selected : ''}`}
                      style={{ backgroundColor: '#f5dd06' }}
                      onClick={() => handleColorChange('yellow')}
                    ></div>
                    <div
                      className={`${styles.colorCircle} ${selectedColors.includes('orange') ? styles.selected : ''}`}
                      style={{ backgroundColor: '#f59606' }}
                      onClick={() => handleColorChange('orange')}
                    ></div>
                    <div
                      className={`${styles.colorCircle} ${selectedColors.includes('blue') ? styles.selected : ''}`}
                      style={{ backgroundColor: '#06d6f5' }}
                      onClick={() => handleColorChange('blue')}
                    ></div>
                  </div>
                  <div className={styles.colorsRow}>
                    <div
                      className={`${styles.colorCircle} ${selectedColors.includes('darkblue') ? styles.selected : ''}`}
                      style={{ backgroundColor: '#063af5' }}
                      onClick={() => handleColorChange('darkblue')}
                    ></div>
                    <div
                      className={`${styles.colorCircle} ${selectedColors.includes('purple') ? styles.selected : ''}`}
                      style={{ backgroundColor: '#c106f5' }}
                      onClick={() => handleColorChange('purple')}
                    ></div>
                    <div
                      className={`${styles.colorCircle} ${selectedColors.includes('pink') ? styles.selected : ''}`}
                      style={{ backgroundColor: '#f5069d' }}
                      onClick={() => handleColorChange('pink')}
                    ></div>
                    <div
                      className={`${styles.colorCircle} ${styles.white} ${selectedColors.includes('white') ? styles.selected : ''}`}
                      style={{ backgroundColor: '#ffffff' }}
                      onClick={() => handleColorChange('white')}
                    ></div>
                    <div
                      className={`${styles.colorCircle} ${selectedColors.includes('black') ? styles.selected : ''}`}
                      style={{ backgroundColor: '#000000' }}
                      onClick={() => handleColorChange('black')}
                    ></div>
                  </div>
                </div>
              </div>

              <div className={styles.separatorLine}></div>

              {/* Size */}
              <div className={styles.filterSection}>
                <div className={styles.filterSectionTitle}>
                  <span>Size</span>
                  <div className={styles.sectionIcon}>
                    <svg width="11.5" height="6.5" viewBox="0 0 11.5 6.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5.75 5.75L10.5 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className={styles.sizesGrid}>
                  {['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'].map(size => (
                    <button
                      key={size}
                      className={`${styles.sizeButton} ${selectedSizes.includes(size.toLowerCase()) ? styles.selected : ''}`}
                      onClick={() => handleSizeChange(size.toLowerCase())}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>


              {/* Apply Filter Button */}
              <button className={styles.applyFilterButton}>
                Apply Filter
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className={styles.productsSection}>
            <div className={styles.productsInfoBar}>
              <span className={styles.showingText}>
                {loading ? 'Loading products...' : `Showing 1-${Math.min(10, filteredProducts.length)} of ${filteredProducts.length} Products`}
              </span>
              <div className={styles.sortAndFilterContainer}>
                <div className={styles.sortContainer}>
                  <span className={styles.sortText}>Sort by: Most Popular</span>
                  <div className={styles.sortIcon}>
                    <svg width="11.5" height="6.5" viewBox="0 0 11.5 6.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5.75 5.75L10.5 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <button className={styles.filterToggleButton} onClick={toggleFilter}>
                  <Image
                    src="/productlisting/filter.svg"
                    alt="Filter"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
            <div className={styles.productsGrid}>
              {loading ? (
                // Show skeleton loading cards
                Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={`skeleton-${index}`} />
                ))
              ) : (
                // Show actual products
                filteredProducts.map((product) => (
                  <Link key={product._id} href={`/products/${product._id}`} className={styles.productCardLink}>
                    <div className={styles.productCard}>
                      <div className={styles.productImageContainer}>
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={300}
                          height={300}
                          className={styles.productImage}
                        />
                      </div>
                      <div className={styles.productInfo}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <div className={styles.productRating}>
                          <span className={styles.stars}>
                            {'★'.repeat(Math.floor(product.rating))}
                            {'☆'.repeat(5 - Math.floor(product.rating))}
                          </span>
                          <span className={styles.ratingText}>{product.rating}/5</span>
                        </div>
                        <div className={styles.productPrice}>
                          {product.discountPrice && product.discountPrice < product.price ? (
                            <>
                              <span className={styles.currentPrice}>₹{product.discountPrice?.toFixed(2)}</span>
                              <span className={styles.originalPrice}>₹{product.price?.toFixed(2)}</span>
                              <span className={styles.discountBadge}>
                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                              </span>
                            </>
                          ) : (
                            <span className={styles.currentPrice}>₹{product.price?.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            {filteredProducts.length === 0 && (
              <div className={styles.noResults}>
                <p className={styles.noResultsText}>No products match your filters.</p>
              </div>
            )}

            {/* Line Separator */}
            <div className={styles.lineSeparator}></div>

            {/* Pagination */}
            <div className={styles.paginationContainer}>
              <button
                className={`${styles.paginationButton} ${styles.previousButton}`}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <div className={styles.buttonIcon}>
                  <svg width="11.67" height="11.67" viewBox="0 0 11.67 11.67" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.17 2.5L4.17 5.5L7.17 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.buttonText}>Previous</span>
              </button>

              <div className={styles.pageNumbers}>
                {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
                  <button
                    key={typeof page === 'number' ? page : `ellipsis-${index}`} // Use page number as key, or a unique string for '...'
                    className={`${styles.pageNumber} ${page === currentPage ? styles.active : ''}`}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className={`${styles.paginationButton} ${styles.nextButton}`}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <span className={styles.buttonText}>Next</span>
                <div className={styles.buttonIcon}>
                  <svg width="11.67" height="11.67" viewBox="0 0 11.67 11.67" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 2.5L7.5 5.5L4.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '20px 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
            <div style={{ position: 'relative' }}>
              <StayUpToDate />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default function ProductsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPage />
    </Suspense>
  );
}