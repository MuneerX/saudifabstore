"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { NewArrivals } from "../../../components/NewArrivals";
import { StayUpToDate } from "../../../components/StayUpToDate";
import styles from "./page.module.css"; // Import CSS module
import { useProducts } from "@/lib/hooks/useProducts";
import { useCart } from "@/lib/hooks/useCart";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
  const { id } = useParams(); // Get ID from URL using useParams
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  useSession();
  const [product, setProduct] = useState<{
    _id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    rating: number;
    numReviews: number;
    stock: number;
    images: string[];
    sizes?: string[];
    colors?: string[];
  } | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('details');
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setPageLoading(true);
      setError(null);
      if (id) { // Use 'id' from useParams
        try {
          const productData = await getProductById(id as string);
          if (productData) {
            setProduct(productData);
            if (productData.sizes && productData.sizes.length > 0) {
              setSelectedSize(productData.sizes[0]);
            }
            if (productData.colors && productData.colors.length > 0) {
              setSelectedColor(productData.colors[0]);
            }
          } else {
            setError("Product not found.");
          }
        } catch (error) {
          console.error("Failed to fetch product:", error);
          setError("Failed to load product details.");
          setProduct(null);
        }
      }
      setPageLoading(false);
    };

    fetchProduct();
  }, [id, getProductById]); // Depend on 'id'

  const handleAddToCart = () => {
    if (product) {
      addToCart(product._id, quantity, selectedSize, selectedColor || "Default Color");
    }
  };

  // Size mapping from symbols to words
  const sizeLabels: { [key: string]: string } = {
    'S': 'Small',
    'M': 'Medium',
    'L': 'Large',
    'XL': 'X-Large',
    'XXL': 'Double X-Large'
  };
 
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
 
  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Function to map color names to actual color values
  const getColorValue = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'white': '#ffffff',
      'black': '#0000',
      'red': '#dc2626',
      'blue': '#2563eb',
      'green': '#16a34a',
      'yellow': '#eab308',
      'purple': '#933ea',
      'pink': '#ec4899',
      'orange': '#ea580c',
      'gray': '#6b7280',
      'navy': '#1e40af',
      'khaki': '#a3a3a3',
      'beige': '#f5f5dc',
      'brown': '#92400e',
      'maroon': '#7f1d1d',
      'teal': '#0d9488',
      'lime': '#65a30d',
      'cyan': '#0891b2',
      'magenta': '#c026d3',
      'silver': '#9ca3af',
      'gold': '#d9706'
    };

    return colorMap[colorName.toLowerCase()] || '#6b7280'; // Default to gray if color not found
  };

  // Skeleton component for product detail page
  const ProductDetailSkeleton = () => (
    <div className={styles.pageContainer}>
      <Navbar hasBorder={true} />

      {/* Breadcrumb Skeleton */}
      <div className={styles.breadcrumbSection}>
        <div className={styles.breadcrumbContainer}>
          <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
            <ol className={styles.breadcrumbList}>
              <li className={styles.breadcrumbItem}>
                <div className={styles.skeletonBreadcrumb}></div>
              </li>
              <li className={styles.breadcrumbSeparator} aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </li>
              <li className={styles.breadcrumbItem}>
                <div className={styles.skeletonBreadcrumb}></div>
              </li>
              <li className={styles.breadcrumbSeparator} aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </li>
              <li className={styles.breadcrumbItem}>
                <div className={styles.skeletonBreadcrumb}></div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Product Details Skeleton */}
      <div className={styles.productDetailsSection}>
        {/* Product Images Skeleton */}
        <div className={styles.productImages}>
          <div className={styles.thumbnailImages}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={styles.thumbnail}>
                <div className={styles.skeletonThumbnail}></div>
              </div>
            ))}
          </div>
          <div className={styles.mainImage}>
            <div className={styles.skeletonMainImage}></div>
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className={styles.productInfo}>
          <div className={styles.productHeader}>
            <div className={styles.skeletonBadge}></div>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonRating}></div>
          </div>

          <div className={styles.skeletonDescription}></div>
          <div className={styles.skeletonPrice}></div>

          {/* Color Selection Skeleton */}
          <div className={styles.skeletonColorSelection}>
            <div className={styles.skeletonColorHeader}>
              <div className={styles.skeletonColorLabel}></div>
              <div className={styles.skeletonColorName}></div>
            </div>
            <div className={styles.skeletonColorOptions}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={styles.skeletonColorButton}></div>
              ))}
            </div>
          </div>

          <div className={styles.sizeSelection}>
            <div className={styles.sizeButtons}>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className={styles.skeletonSizeButton}></div>
              ))}
            </div>
          </div>

          <div className={styles.actionButtons}>
            <div className={styles.skeletonAddToCart}></div>
            <div className={styles.quantityControls}>
              <div className={styles.skeletonQuantityButton}></div>
              <div className={styles.skeletonQuantityDisplay}></div>
              <div className={styles.skeletonQuantityButton}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs Skeleton */}
      <div className={styles.tabsSection}>
        <div className={styles.tabsContainer}>
          <div className={styles.tabsHeader}>
            <div className={styles.skeletonTab}></div>
            <div className={styles.skeletonTab}></div>
            <div className={styles.skeletonTab}></div>
          </div>
          <div className={styles.tabContent}>
            <div className={styles.skeletonTabContent}></div>
          </div>
        </div>
      </div>

      {/* You Might Also Like Skeleton */}
      <section style={{ backgroundColor: '#ffffff', padding: '20px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ position: 'relative' }}>
            <div className={styles.skeletonSectionTitle}></div>
            <div className={styles.skeletonProductsGrid}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={styles.skeletonProductCard}>
                  <div className={styles.skeletonProductImage}></div>
                  <div className={styles.skeletonProductInfo}>
                    <div className={styles.skeletonProductTitle}></div>
                    <div className={styles.skeletonProductRating}></div>
                    <div className={styles.skeletonProductPrice}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div style={{ position: 'relative' }}>
        <StayUpToDate />
        <Footer />
      </div>
    </div>
  );

  if (pageLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Navbar hasBorder={true} />
        <div className={styles.loadingContainer}>
          <div>{error}</div>
        </div>
        <div style={{ position: 'relative' }}>
          <StayUpToDate />
          <Footer />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.pageContainer}>
        <Navbar hasBorder={true} />
        <div className={styles.loadingContainer}>
          <div>Product not found.</div>
        </div>
        <div style={{ position: 'relative' }}>
          <StayUpToDate />
          <Footer />
        </div>
      </div>
    );
  }
 
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
                <Link href="/shop" className={styles.breadcrumbLink}>Shop</Link>
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
                <Link href="/shop/men" className={styles.breadcrumbLink}>Men</Link>
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
                <span className={styles.breadcrumbCurrent}>T-shirt</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className={styles.productDetailsSection}>
        <div className={styles.productImages}>
          <div className={styles.thumbnailImages}>
            {product.images?.map((image: string, index: number) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${selectedImageIndex === index ? styles.selectedThumbnail : ''}`}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={120}
                  height={160}
                  className={styles.thumbnailImg}
                />
              </div>
            ))}
          </div>
          <div className={styles.mainImage}>
            <Image
              src={product.images?.[selectedImageIndex] || ''}
              alt={product.name}
              width={400}
              height={500}
              className={styles.mainImageImg}
            />
          </div>
        </div>
        
        <div className={styles.productInfo}>
          <div className={styles.productHeader}>
            <span className={styles.stockBadge}>In Stock ({product.stock} left)</span>
            <h1 className={styles.productName}>{product.name}</h1>
            <div className={styles.ratingSection}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`${styles.starIcon} ${i < Math.floor(product.rating || 0) ? styles.filledStar : styles.emptyStar}`} 
                  />
                ))}
              </div>
              <span className={styles.ratingText}>
                {product.rating || 0} ({product.numReviews || 0} reviews)
              </span>
            </div>
          </div>

          <p className={styles.productDescription}>
            {product.description}
          </p>

          <div className={styles.priceSection}>
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

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className={styles.colorSelection}>
              <div className={styles.colorHeader}>
                <span className={styles.colorLabel}>Color:</span>
                <span className={styles.selectedColorName}>
                  {selectedColor || product.colors[0]}
                </span>
              </div>
              <div className={styles.colorOptions}>
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    className={`${styles.colorButton} ${
                      selectedColor === color ? styles.selectedColorButton : ''
                    }`}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select ${color} color`}
                    title={color}
                  >
                    <div
                      className={styles.colorSwatch}
                      style={{
                        backgroundColor: getColorValue(color),
                        border: color.toLowerCase() === 'white' ? '1px solid #e0e0e0' : 'none'
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.sizeSelection}>
            <div className={styles.sizeButtons}>
              {product.sizes?.map((size: string) => (
                <button
                  key={size}
                  className={`${styles.sizeButton} ${selectedSize === size ? styles.selectedSizeButton : styles.unselectedSizeButton}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {sizeLabels[size] || size}
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.actionButtons}>
            <button className={styles.addToCartButton} onClick={handleAddToCart}>
              <ShoppingCart className={styles.cartIcon} />
              Add to Bag
            </button>
            <div className={styles.quantityControls}>
              <button className={styles.quantityButton} onClick={decreaseQuantity}>-</button>
              <span className={styles.quantityDisplay}>{quantity}</span>
              <button className={styles.quantityButton} onClick={increaseQuantity}>+</button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Product Tabs Section */}
      <div className={styles.tabsSection}>
        <div className={styles.tabsContainer}>
          <div className={styles.tabsHeader}>
            <button className={`${styles.tabButton} ${activeTab === 'details' ? styles.activeTab : ''}`} onClick={() => setActiveTab('details')}>
              Product Details
            </button>
            <button className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.activeTab : ''}`} onClick={() => setActiveTab('reviews')}>
              Rating & Reviews
            </button>
            <button className={`${styles.tabButton} ${activeTab === 'faq' ? styles.activeTab : ''}`} onClick={() => setActiveTab('faq')}>
              FAQ
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'details' && (
              <div className={styles.detailsContent}>
                <h3>Product Information</h3>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <h4>Fabric & Material</h4>
                    <p>100% Premium Cotton - Our classic cotton t-shirt is made from high-quality, ring-spun cotton that&apos;s soft, breathable, and durable. The fabric has been pre-shrunk to maintain its shape and fit after washing.</p>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>Care Instructions</h4>
                    <p>• Machine wash cold with like colors<br/>
                    • Tumble dry low or hang dry to preserve fabric quality<br/>
                    • Do not bleach or use fabric softener<br/>
                    • Iron on low heat if needed<br/>
                    • Wash inside out to maintain color vibrancy</p>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>Fit & Sizing</h4>
                    <p>Regular fit with a comfortable, relaxed silhouette that flatters all body types. The t-shirt features a classic crew neck and short sleeves. True to size - we recommend ordering your usual size for the perfect fit.</p>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>Features</h4>
                    <p>• Reinforced stitching at neck and armholes for durability<br/>
                    • Tagless design for comfort<br/>
                    • Pre-shrunk fabric to prevent shrinkage<br/>
                    • Colorfast dyes that won&apos;t fade<br/>
                    • Made with sustainable cotton sourcing</p>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>Origin</h4>
                    <p>Designed in California, ethically manufactured in our partner facilities with fair labor practices and sustainable production methods.</p>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>Warranty</h4>
                    <p>30-day satisfaction guarantee. If you&apos;re not completely happy with your purchase, return it for a full refund within 30 days of delivery.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.reviewsContent}>
                <h3>Customer Reviews</h3>
                <div className={styles.ratingSummary}>
                  <div className={styles.overallRating}>
                    <span className={styles.ratingNumber}>{product.rating || 0}</span>
                    <div className={styles.ratingStars}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`${styles.starIcon} ${i < Math.floor(product.rating || 0) ? styles.filledStar : styles.emptyStar}`}
                        />
                      ))}
                    </div>
                    <span className={styles.reviewCount}>{product.numReviews || 0} reviews</span>
                  </div>
                  <div className={styles.reviewActions}>
                    <button className={styles.writeReviewButton}>
                      Write a Review
                    </button>
                    <button className={styles.filterButton}>
                      Filter
                    </button>
                  </div>
                </div>
                <div className={styles.reviewList}>
                  {/* Mock reviews - replace with actual reviews from backend */}
                  <div className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <span className={styles.reviewerName}>Sarah Johnson</span>
                      <div className={styles.reviewStars}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`${styles.starIcon} ${i < 5 ? styles.filledStar : styles.emptyStar}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className={styles.reviewDate}>2 weeks ago</span>
                  </div>
                  <p className={styles.reviewText}>
                    Absolutely love this t-shirt! The fabric is incredibly soft and comfortable. Perfect fit and the quality is outstanding. Highly recommend!
                  </p>
                </div>

                <div className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <span className={styles.reviewerName}>Mike Chen</span>
                      <div className={styles.reviewStars}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`${styles.starIcon} ${i < 4 ? styles.filledStar : styles.emptyStar}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className={styles.reviewDate}>1 month ago</span>
                  </div>
                  <p className={styles.reviewText}>
                    Great quality cotton t-shirt. Fits true to size and the color is exactly as shown. Would definitely buy again.
                  </p>
                </div>

                <div className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <span className={styles.reviewerName}>Emma Davis</span>
                      <div className={styles.reviewStars}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`${styles.starIcon} ${i < 5 ? styles.filledStar : styles.emptyStar}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className={styles.reviewDate}>3 weeks ago</span>
                  </div>
                  <p className={styles.reviewText}>
                    This is my third purchase of this style. The comfort and durability are unmatched. Perfect for everyday wear!
                  </p>
                </div>

                <div className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <span className={styles.reviewerName}>Alex Rodriguez</span>
                      <div className={styles.reviewStars}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`${styles.starIcon} ${i < 4 ? styles.filledStar : styles.emptyStar}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className={styles.reviewDate}>1 week ago</span>
                  </div>
                  <p className={styles.reviewText}>
                    Nice t-shirt with good quality fabric. The fit is comfortable and it&apos;s held up well after several washes. Good value for money.
                  </p>
                </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className={styles.faqContent}>
                <h3>Frequently Asked Questions</h3>
                <div className={styles.faqList}>
                  <div className={styles.faqItem}>
                    <h4>What is the material composition?</h4>
                    <p>This t-shirt is made from 100% premium ring-spun cotton. It&apos;s soft, breathable, and designed to maintain its shape and color even after multiple washes.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h4>How should I care for this item?</h4>
                    <p>Machine wash cold with like colors, tumble dry low or hang dry. Do not bleach or use fabric softener. Wash inside out to preserve the color. Iron on low heat if needed.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h4>What is the fit like?</h4>
                    <p>This t-shirt has a regular fit with a comfortable, relaxed silhouette. It features a classic crew neck and short sleeves. We recommend ordering your usual size for the best fit.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h4>Is this product available in other sizes?</h4>
                    <p>Yes, this product is available in sizes: {product.sizes?.join(', ') || 'Small, Medium, Large, X-Large, XX-Large'}. All sizes follow our standard sizing chart.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h4>Does this product shrink after washing?</h4>
                    <p>Our cotton t-shirts are pre-shrunk during manufacturing, so they maintain their size and shape after washing. However, we still recommend following the care instructions for best results.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h4>Is this product suitable for layering?</h4>
                    <p>Yes! The regular fit and soft cotton fabric make it perfect for layering under jackets, hoodies, or cardigans. It&apos;s also great as a standalone piece for casual wear.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h4>How long does the color last?</h4>
                    <p>We use colorfast dyes that are designed to resist fading. The color vibrancy is maintained through proper care and washing inside out with cold water.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h4>Can I return or exchange this item?</h4>
                    <p>Yes, we offer a 30-day satisfaction guarantee. If you&apos;re not completely happy with your purchase, you can return it for a full refund or exchange within 30 days of delivery.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* You Might Also Like Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '20px 0 150px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{
            position: 'relative'
          }}>
            <NewArrivals title="YOU MIGHT ALSO LIKE" />
          </div>
        </div>
      </section>
      <div style={{ position: 'relative' }}>
        <StayUpToDate />
        <Footer />
      </div>
    </div>
  );
}