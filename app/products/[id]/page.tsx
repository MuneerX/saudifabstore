"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Share2,
  Heart,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Star,
  ChevronDown,
  Truck,
  Store,
  Clock,
  RotateCcw,
  Info,
  MapPin,
  ShieldCheck,
  FileText,
  Award,
  Building2,
  Lock,
  CheckCircle2,
  Check
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import { useProducts } from "@/lib/hooks/useProducts";
import { useCartContext } from "@/components/CartContext";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkSquare01Icon, ShoppingCart01Icon, DeliveryBox01Icon, CheckmarkBadge01Icon, LicenseIcon, PackageIcon, DeliveryReturn02Icon, Award04Icon, SecurityCheckIcon, LockKeyholeIcon, AnvilIcon, Store01Icon, DeliveryTruck01Icon, Location01Icon, InformationSquareIcon, CouponPercentIcon, PercentSquareIcon, PercentIcon, SaudiRiyalIcon } from "@hugeicons/core-free-icons";
import { WalmartPopularCarouselSection } from "@/components/WalmartPopularCarouselSection";
import { AboutTermsFooterSection } from "@/components/AboutTermsFooterSection";
import { INITIAL_PRODUCTS } from "@/lib/data/initialProducts";
import { getDynamicBadge, calculateCatalogStats } from "@/lib/utils/badgeHelper";

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { getProductById, fetchProducts, products } = useProducts() as any;
  const { addToCart } = useCartContext();

  const [product, setProduct] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant Swatch state
  const [selectedSwatch, setSelectedSwatch] = useState<string>("single");

  // Purchase Mode state ('one-time' | 'subscribe')
  const [purchaseMode, setPurchaseMode] = useState<"one-time" | "subscribe">("one-time");

  // Fulfillment state ('shipping' | 'pickup' | 'delivery')
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"shipping" | "pickup" | "delivery">("shipping");

  // Expandable Accordions state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    aboutDetails: true,
    specs: false,
    certs: false,
    returnsPolicy: false,
    shippingTerms: false,
  });

  const handleReadMoreClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setOpenAccordions(prev => ({ ...prev, aboutDetails: true }));
    const target = document.getElementById("about-item-section");
    if (target) {
      const yOffset = -90;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  };

  // Description Read More / Truncation state
  const [isDescExpanded, setIsDescExpanded] = useState<boolean>(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setPageLoading(true);
      setError(null);
      if (id) {
        try {
          const productData = await getProductById(id as string);
          if (productData) {
            setProduct(productData);
          } else {
            setError("Product not found.");
          }
        } catch (err) {
          console.error("Failed to fetch product:", err);
          setError("Failed to load product details.");
        }
      }
      setPageLoading(false);
    };

    fetchProductData();
  }, [id, getProductById]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (pageLoading) {
    return (
      <div className={styles.pageContainer}>
        <Navbar isLight={true} hasBorder={true} />

        <main className={styles.pdpMainWrapper}>
          
          {/* 1. Breadcrumb Skeleton */}
          <nav className={styles.breadcrumbNav} style={{ marginBottom: "20px" }}>
            <div style={{ width: "45px", height: "14px" }} className={styles.skeletonShimmer} />
            <span>/</span>
            <div style={{ width: "60px", height: "14px" }} className={styles.skeletonShimmer} />
            <span>/</span>
            <div style={{ width: "130px", height: "14px" }} className={styles.skeletonShimmer} />
            <span>/</span>
            <div style={{ width: "180px", height: "14px" }} className={styles.skeletonShimmer} />
          </nav>

          {/* 2. Walmart PDP Main Container Grid */}
          <div className={styles.walmartPdpGrid}>
            
            {/* LEFT MAIN CONTENT CONTAINER (Stage + Details + Bottom Accordions) */}
            <div className={styles.mainLeftContent}>
              
              {/* Top Split Row: Gallery (Left) + Middle Product Details Column */}
              <div className={styles.topSplitRow}>
                
                {/* 1. LEFT GALLERY COLUMN SKELETON */}
                <div className={styles.galleryCol}>
                  {/* Vertical Thumbnail Bar */}
                  <div className={styles.thumbnailList}>
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} style={{ width: "64px", height: "64px", borderRadius: "8px" }} className={styles.skeletonShimmer} />
                    ))}
                  </div>

                  {/* Main Stage Image Box */}
                  <div className={styles.mainStageBox} style={{ backgroundColor: "#f8fafc" }}>
                    <div style={{ width: "100%", height: "100%" }} className={styles.skeletonShimmer} />
                  </div>
                </div>

                {/* 2. MIDDLE COLUMN SKELETON */}
                <div className={styles.detailsCol}>
                  {/* Badges Row */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div style={{ width: "110px", height: "22px", borderRadius: "4px" }} className={styles.skeletonShimmer} />
                    <div style={{ width: "90px", height: "22px", borderRadius: "4px" }} className={styles.skeletonShimmer} />
                  </div>

                  {/* Brand Link */}
                  <div style={{ width: "160px", height: "14px" }} className={styles.skeletonShimmer} />

                  {/* Product Title */}
                  <div style={{ width: "90%", height: "32px" }} className={styles.skeletonShimmer} />
                  <div style={{ width: "65%", height: "32px" }} className={styles.skeletonShimmer} />

                  {/* Price Header Block */}
                  <div className={styles.priceHeaderBlock}>
                    <div style={{ width: "140px", height: "14px", marginBottom: "8px" }} className={styles.skeletonShimmer} />
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "60px", height: "24px", borderRadius: "12px" }} className={styles.skeletonShimmer} />
                      <div style={{ width: "140px", height: "36px" }} className={styles.skeletonShimmer} />
                      <div style={{ width: "110px", height: "16px" }} className={styles.skeletonShimmer} />
                    </div>
                  </div>

                  {/* Pack Size Swatches Skeleton */}
                  <div className={styles.swatchSection}>
                    <div style={{ width: "130px", height: "16px", marginBottom: "10px" }} className={styles.skeletonShimmer} />
                    <div className={styles.swatchesGrid}>
                      <div className={styles.swatchCard} style={{ height: "64px" }}>
                        <div style={{ width: "70%", height: "16px" }} className={styles.skeletonShimmer} />
                        <div style={{ width: "40%", height: "14px" }} className={styles.skeletonShimmer} />
                      </div>
                      <div className={styles.swatchCard} style={{ height: "64px" }}>
                        <div style={{ width: "70%", height: "16px" }} className={styles.skeletonShimmer} />
                        <div style={{ width: "40%", height: "14px" }} className={styles.skeletonShimmer} />
                      </div>
                    </div>
                  </div>

                  {/* Product Details Paragraph Skeleton */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                    <div style={{ width: "35%", height: "18px", marginBottom: "4px" }} className={styles.skeletonShimmer} />
                    <div style={{ width: "100%", height: "14px" }} className={styles.skeletonShimmer} />
                    <div style={{ width: "95%", height: "14px" }} className={styles.skeletonShimmer} />
                    <div style={{ width: "80%", height: "14px" }} className={styles.skeletonShimmer} />
                  </div>

                  {/* Trust Grid Skeleton */}
                  <div className={styles.middleTrustGrid}>
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className={styles.middleTrustItem} style={{ border: "none", backgroundColor: "transparent" }}>
                        <div style={{ width: "18px", height: "18px", borderRadius: "50%" }} className={styles.skeletonShimmer} />
                        <div style={{ width: "120px", height: "13px" }} className={styles.skeletonShimmer} />
                      </div>
                    ))}
                  </div>

                </div>

              </div>

              {/* Bottom Policy & Accordions Section Skeleton */}
              <div className={styles.aboutItemSection}>
                <div style={{ width: "180px", height: "24px", marginBottom: "16px" }} className={styles.skeletonShimmer} />
                <div className={styles.policyAccordionList}>
                  {[1, 2, 3].map((n) => (
                    <div key={n} className={styles.policyAccordionItem} style={{ padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ width: "200px", height: "18px" }} className={styles.skeletonShimmer} />
                        <div style={{ width: "16px", height: "16px", borderRadius: "50%" }} className={styles.skeletonShimmer} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* 3. RIGHT WALMART BUY BOX COLUMN SKELETON */}
            <div className={styles.buyBoxCol}>
              <div className={styles.buyBoxCard}>
                {/* Price Header Block */}
                <div className={styles.priceHeaderBlock}>
                  <div style={{ width: "140px", height: "14px", marginBottom: "8px" }} className={styles.skeletonShimmer} />
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "50px", height: "22px", borderRadius: "12px" }} className={styles.skeletonShimmer} />
                    <div style={{ width: "120px", height: "34px" }} className={styles.skeletonShimmer} />
                  </div>
                </div>

                {/* Purchase Mode Toggle Skeleton */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "16px 0" }}>
                  <div style={{ height: "52px", borderRadius: "8px" }} className={styles.skeletonShimmer} />
                  <div style={{ height: "52px", borderRadius: "8px" }} className={styles.skeletonShimmer} />
                </div>

                {/* Quantity Selector Skeleton */}
                <div style={{ width: "100%", height: "40px", borderRadius: "8px", marginBottom: "16px" }} className={styles.skeletonShimmer} />

                {/* Action Buttons Skeleton */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ width: "100%", height: "48px", borderRadius: "24px" }} className={styles.skeletonShimmer} />
                  <div style={{ width: "100%", height: "48px", borderRadius: "24px" }} className={styles.skeletonShimmer} />
                </div>

                {/* Security Guarantee Badges Skeleton */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ width: "100%", height: "16px" }} className={styles.skeletonShimmer} />
                  <div style={{ width: "80%", height: "16px" }} className={styles.skeletonShimmer} />
                </div>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.pageContainer}>
        <Navbar isLight={true} hasBorder={true} />
        <div style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h2>{error || "Product not found."}</h2>
        </div>
        <Footer />
      </div>
    );
  }

  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : ["/uploads/3ea54b4f-1709-49b3-be9c-1b4302dc01e9.jpg", "/uploads/1eecdedc-cd94-4183-ab5b-3010a00e0ef1.png", "/uploads/49dc8447-7b24-4eaf-b051-7700b2145207.png"];

  const currentImage = galleryImages[activeImageIndex] || galleryImages[0];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getSelectedOptionLabel = () => {
    let label = selectedSwatch === "single"
      ? (product.swatchSingleName || "Single Pack")
      : (product.swatchBulkName || "Bulk 5-Pack");
    
    if (purchaseMode === "subscribe") {
      label += " (Monthly Auto-Restock -10% OFF)";
    }
    return label;
  };

  const handleAddToCart = () => {
    const swatchLabel = getSelectedOptionLabel();
    addToCart(product._id, 1, swatchLabel, "SASO Industrial Finish");
  };

  const handleInstantCheckout = () => {
    if (!product) return;
    const swatchLabel = getSelectedOptionLabel();
    router.push(`/checkout?instant=true&productId=${encodeURIComponent(product._id)}&qty=1&swatch=${encodeURIComponent(swatchLabel)}&price=${currentPrice}`);
  };

  const basePrice = selectedSwatch === "single" ? product.price : product.price * 4.2;
  const currentPrice = purchaseMode === "subscribe" ? basePrice * 0.9 : basePrice;
  const isDiscounted = purchaseMode === "subscribe" || selectedSwatch === "bulk";

  return (
    <div className={styles.pageContainer}>
      <Navbar isLight={true} hasBorder={true} />

      <main className={styles.pdpMainWrapper}>
        
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumbNav}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span>/</span>
          <Link href="/products" className={styles.breadcrumbLink}>Products</Link>
          <span>/</span>
          <Link href={`/products?category=${encodeURIComponent(product.category || "Hardware & Piping")}`} className={styles.breadcrumbLink}>
            {product.category || "Hardware & Piping"}
          </Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        {/* Walmart PDP Main Container Grid */}
        <div className={styles.walmartPdpGrid}>
          
          {/* LEFT MAIN CONTENT CONTAINER (Stage + Details + Bottom Accordions) */}
          <div className={styles.mainLeftContent}>
            
            {/* Top Split Row: Gallery (Left) + Middle Product Details Column */}
            <div className={styles.topSplitRow}>
              
              {/* 1. LEFT GALLERY COLUMN */}
              <div className={styles.galleryCol}>
                
                {/* Vertical Thumbnail Bar */}
                <div className={styles.thumbnailList}>
                  {galleryImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.thumbnailBtn} ${activeImageIndex === idx ? styles.activeThumbnailBtn : ""}`}
                      onClick={() => setActiveImageIndex(idx)}
                    >
                      <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className={styles.thumbnailImg} unoptimized />
                    </button>
                  ))}
                </div>

                {/* Main Stage Image Box */}
                <div className={styles.mainStageBox}>
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    className={styles.mainStageImg}
                    priority
                    unoptimized
                  />

                  {/* Top Right Floating Action Icons */}
                  <div className={styles.floatingActionIcons}>
                    <button
                      type="button"
                      className={styles.circleActionBtn}
                      title="Share"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: product.name, url: window.location.href });
                        }
                      }}
                    >
                      <Share2 size={18} />
                    </button>
                    <button type="button" className={styles.circleActionBtn} title="Zoom">
                      <ZoomIn size={18} />
                    </button>
                  </div>

                  {/* Floating Stage Navigation Arrows */}
                  {galleryImages.length > 1 && (
                    <>
                      <button type="button" className={`${styles.stageNavBtn} ${styles.stageNavBtnPrev}`} onClick={handlePrevImage}>
                        <ChevronLeft size={20} />
                      </button>
                      <button type="button" className={`${styles.stageNavBtn} ${styles.stageNavBtnNext}`} onClick={handleNextImage}>
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

              </div>

              {/* 2. MIDDLE COLUMN: WALMART STYLE PRODUCT DETAILS & HIGHLIGHTS */}
              <div className={styles.detailsCol}>
                
                {/* Walmart Top Badges Row (Displays official dynamic badge + custom admin promo badge side-by-side) */}
                {(() => {
                  const catalogStats = calculateCatalogStats(products || []);
                  const dynamicBadge = getDynamicBadge(product, styles, catalogStats);
                  const customBadgeText = (product.promoBadge || "").trim();

                  const badgesToDisplay: string[] = [];

                  if (dynamicBadge) {
                    badgesToDisplay.push(dynamicBadge.text);
                  }

                  if (customBadgeText && (!dynamicBadge || customBadgeText.toUpperCase() !== dynamicBadge.text.toUpperCase())) {
                    badgesToDisplay.push(customBadgeText.toUpperCase());
                  }

                  if (badgesToDisplay.length === 0) {
                    badgesToDisplay.push("FACTORY DIRECT");
                  }

                  return (
                    <div className={styles.topBadgesRow} style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      {badgesToDisplay.map((txt, index) => (
                        <span
                          key={index}
                          className={styles.darkBluePickBadge}
                          style={index > 0 ? { backgroundColor: "#0284c7", color: "#ffffff" } : undefined}
                        >
                          {txt}
                        </span>
                      ))}
                    </div>
                  );
                })()}

                {/* Brand Link */}
                <div>
                  <span className={styles.brandLinkText}>Visit the Saudi Fab Store</span>
                </div>

                {/* Product Title */}
                <h1 className={styles.productTitle}>{product.name}</h1>

                {/* Walmart Style Price Header Block */}
                <div className={styles.priceHeaderBlock}>
                  <div className={styles.priceOnlineNotice}>
                    <span>Price when purchased online</span>
                    <button type="button" className={styles.infoTooltipBtn} title="Direct online factory pricing">
                      <Info size={13} />
                    </button>
                  </div>
                  
                  <div className={styles.priceNowRow} style={{ alignItems: "center", gap: "10px" }}>
                    {/* -18% Savings Pill Badge BEFORE price text */}
                    <span className={styles.savingsCallout}>
                      -{purchaseMode === "subscribe" && selectedSwatch === "bulk" ? "23.5%" : purchaseMode === "subscribe" ? "10%" : selectedSwatch === "bulk" ? "15%" : "18%"}
                    </span>

                    {/* Superscript Current Price */}
                    <div className={styles.priceSuperRow}>
                      <span className={styles.priceSuperCurrency} style={{ display: "inline-flex", alignItems: "center" }}>
                        <HugeiconsIcon icon={SaudiRiyalIcon} size={18} strokeWidth={2.2} />
                      </span>
                      <span className={styles.priceMainInteger}>{Math.floor(currentPrice).toLocaleString()}</span>
                      <sup className={styles.priceSuperCents}>.{(currentPrice % 1).toFixed(2).substring(2) || "00"}</sup>
                    </div>
                    
                    {/* Strikethrough MSRP Original List Price */}
                    <span className={styles.priceOriginalCross} style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                      List Price: <HugeiconsIcon icon={SaudiRiyalIcon} size={13} strokeWidth={2.0} /> {(basePrice * (purchaseMode === "subscribe" ? 1.111 : 1.22)).toFixed(2)}
                    </span>
                  </div>

                  {/* Middle Column Tax Information Line - Exactly matching Price when purchased online style */}
                  <div className={styles.priceOnlineNotice} style={{ marginTop: "3px" }}>
                    <span>All prices include 15% KSA VAT. Commercial Tax Invoice provided upon dispatch.</span>
                  </div>
                </div>

                {/* Variant Pack Size Swatches (Only displayed for Multiple Option products) */}
                {Boolean(product.hasMultipleOptions) && (
                  <div className={styles.swatchSection}>
                    <div className={styles.swatchLabel}>Pack Size / Spec Option:</div>
                    <div className={styles.swatchesGrid}>
                      
                      {/* Option 1: Single */}
                      <div
                        className={`${styles.swatchCard} ${selectedSwatch === "single" ? styles.activeSwatchCard : ""}`}
                        onClick={() => setSelectedSwatch("single")}
                      >
                        <div className={styles.swatchName}>{product.swatchSingleName || "Single Standard"}</div>
                        <div className={styles.swatchPrice} style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                          <HugeiconsIcon icon={SaudiRiyalIcon} size={13} strokeWidth={2.0} /> {product.price?.toFixed(2)}
                        </div>
                      </div>

                      {/* Option 2: 5 Pack */}
                      <div
                        className={`${styles.swatchCard} ${selectedSwatch === "bulk" ? styles.activeSwatchCard : ""}`}
                        onClick={() => setSelectedSwatch("bulk")}
                      >
                        <div className={styles.swatchName}>{product.swatchBulkName || "5-Pack Contractors"}</div>
                        <div className={styles.swatchPrice} style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                          <HugeiconsIcon icon={SaudiRiyalIcon} size={13} strokeWidth={2.0} /> {(product.swatchBulkPrice || product.price * 4.2).toFixed(2)}
                        </div>
                        <div className={styles.swatchSubtext}>Save 15%</div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Middle Column Product Details Description & Feature Bullets */}
                <div style={{ marginTop: "8px" }}>
                  <h4 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0" }}>
                    Product Details &amp; Highlights
                  </h4>

                  {/* Description Paragraph */}
                  <p style={{ fontSize: "13.5px", color: "#334155", lineHeight: "1.5", margin: "0 0 10px 0" }}>
                    {product?.description || `${product?.name} is engineered for professional industrial applications across Saudi Arabia, fully compliant with modern structural and safety standards.`}
                  </p>

                  {/* Bullet Points List (fills space left by options on Single Option products) */}
                  {!product.hasMultipleOptions && (
                    <ul style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 12px 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "7px"
                    }}>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#1e293b", fontWeight: "600", lineHeight: "1.3" }}>
                        <Check size={15} style={{ color: "#0058a3", flexShrink: 0, marginTop: "1px" }} />
                        <span>Industrial grade manufacturing &amp; SASO safety compliant</span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#1e293b", fontWeight: "600", lineHeight: "1.3" }}>
                        <Check size={15} style={{ color: "#0058a3", flexShrink: 0, marginTop: "1px" }} />
                        <span>SA 2.5 protective abrasive grit blasted surface coating</span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#1e293b", fontWeight: "600", lineHeight: "1.3" }}>
                        <Check size={15} style={{ color: "#0058a3", flexShrink: 0, marginTop: "1px" }} />
                        <span>100% Quality inspected with MTR mill test certificates</span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#1e293b", fontWeight: "600", lineHeight: "1.3" }}>
                        <Check size={15} style={{ color: "#0058a3", flexShrink: 0, marginTop: "1px" }} />
                        <span>Direct factory workshop dispatch across KSA &amp; GCC</span>
                      </li>
                    </ul>
                  )}

                  <button
                    type="button"
                    onClick={handleReadMoreClick}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0058a3",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "underline",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "2px"
                    }}
                  >
                    <span>Read full technical specifications &rsaquo;</span>
                  </button>
                </div>

                {/* 2-Row x 2-Column Brand Guarantees Grid (Direct Child of detailsCol for bottom alignment) */}
                <div className={styles.middleTrustGrid}>
                  <div className={styles.middleTrustItem}>
                    <HugeiconsIcon icon={SecurityCheckIcon} size={18} strokeWidth={2.2} className={styles.middleTrustIcon} />
                    <span>2 Year Manufacturer Warranty</span>
                  </div>
                  <div className={styles.middleTrustItem}>
                    <HugeiconsIcon icon={DeliveryReturn02Icon} size={18} strokeWidth={2.2} className={styles.middleTrustIcon} />
                    <span>Easy &amp; Hassle-Free Site Returns</span>
                  </div>
                  <div className={styles.middleTrustItem}>
                    <HugeiconsIcon icon={Award04Icon} size={18} strokeWidth={2.2} className={styles.middleTrustIcon} />
                    <span>SASO &amp; ISO 9001 Certified Quality</span>
                  </div>
                  <div className={styles.middleTrustItem}>
                    <HugeiconsIcon icon={LockKeyholeIcon} size={18} strokeWidth={2.2} className={styles.middleTrustIcon} />
                    <span>Secure Commercial Payments</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Span: "About this item" Policy & Technical Accordions Section */}
            <div id="about-item-section" className={styles.aboutItemSection}>
              <h2 className={styles.aboutItemTitle}>About this item</h2>

              <div className={styles.policyAccordionList}>
                
                {/* Accordion 1: Product details & Overview (Restored) */}
                <div className={styles.policyAccordionItem}>
                  <button
                    type="button"
                    className={styles.policyAccordionHeader}
                    onClick={() => toggleAccordion("aboutDetails")}
                  >
                    <span>Product details</span>
                    <ChevronDown
                      size={20}
                      style={{ transform: openAccordions["aboutDetails"] !== false ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    />
                  </button>
                  {openAccordions["aboutDetails"] !== false && (
                    <div className={styles.policyAccordionContent}>
                      <p style={{ margin: "0 0 12px 0", lineHeight: "1.6" }}>
                        {product.description || `${product.name} is manufactured to international ISO 9001:2015 and Saudi SASO structural standards at our Dammam manufacturing hub. Designed for severe operational environments, heavy load bearing, and long-term corrosion resistance.`}
                      </p>
                      <ul style={{ paddingLeft: "20px", margin: "0 0 14px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <li>Industrial grade manufacturing &amp; SASO safety compliant.</li>
                        <li>Commercial SA 2.5 protective abrasive grit blasted surface finish.</li>
                        <li>100% Quality inspected &amp; certified traceable materials.</li>
                        <li>Direct factory workshop dispatch across KSA &amp; GCC.</li>
                        <li>Full technical documentation &amp; warranty support included.</li>
                        <li>Full Mill Test Certificate (MTR) documentation traceable to heat numbers.</li>
                        <li>High load capacity proof-tested to Safe Working Load (SWL) criteria.</li>
                        <li>SASO &amp; ISO 9001:2015 registered manufacturing quality assurance.</li>
                      </ul>

                      <div className={styles.disclaimerNoticeBox}>
                        <HugeiconsIcon icon={InformationSquareIcon} size={18} strokeWidth={2.2} style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span>
                          <strong>Accurate product information:</strong> We aim to show you accurate product details and technical dimensions. Manufacturers and technical engineers provide what you see here. <span className={styles.disclaimerLink}>See compliance details &rsaquo;</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Technical Specifications & Product Table */}
                <div className={styles.policyAccordionItem}>
                  <button
                    type="button"
                    className={styles.policyAccordionHeader}
                    onClick={() => toggleAccordion("specs")}
                  >
                    <span>Specifications &amp; Technical Data</span>
                    <ChevronDown
                      size={20}
                      style={{ transform: openAccordions["specs"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    />
                  </button>
                  {openAccordions["specs"] && (
                    <div className={styles.policyAccordionContent}>
                      {/* Simple Left-Aligned Technical Diagram with Natural Image Height */}
                      {Boolean(product.specImage && product.specImage.trim() !== '') && (
                        <div className={styles.specDiagramImageWrapper}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.specImage}
                            alt={`${product.name} Technical Specification Diagram`}
                            className={styles.specDiagramImg}
                          />
                        </div>
                      )}

                      <table className={styles.amazonTechTable}>
                        <tbody>
                          <tr>
                            <td>Manufacturer / Brand</td>
                            <td>Saudi Fab Store Direct</td>
                          </tr>
                          <tr>
                            <td>Item Model Number</td>
                            <td>SF-B2B-{product._id.toUpperCase()}</td>
                          </tr>
                          <tr>
                            <td>Structural Grade &amp; Material</td>
                            <td>{product.material || "ASTM A36 Carbon Steel / S275JR"}</td>
                          </tr>
                          <tr>
                            <td>Product Dimensions (H x W x D)</td>
                            <td>{product.dimensions || "120cm x 85cm x 60cm"}</td>
                          </tr>
                          <tr>
                            <td>Item Weight / Proof SWL</td>
                            <td>{product.weight || "35.0 kg"} (Proof-tested SWL)</td>
                          </tr>
                          <tr>
                            <td>Surface Preparation &amp; Coating</td>
                            <td>SA 2.5 Abrasive Grit Blasting &amp; Polyurethane Finish</td>
                          </tr>
                          <tr>
                            <td>Compliance &amp; Certifications</td>
                            <td>SASO Certified, ISO 9001:2015 &amp; MTR Traceable</td>
                          </tr>
                          <tr>
                            <td>Manufacturing Hub Origin</td>
                            <td>Dammam Industrial City, Kingdom of Saudi Arabia</td>
                          </tr>
                          <tr>
                            <td>Warranty Coverage</td>
                            <td>2-Year Full Manufacturer Warranty</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Fabrication & Certifications */}
                <div className={styles.policyAccordionItem}>
                  <button
                    type="button"
                    className={styles.policyAccordionHeader}
                    onClick={() => toggleAccordion("certs")}
                  >
                    <span>Fabrication, Weld Testing &amp; Certifications</span>
                    <ChevronDown
                      size={20}
                      style={{ transform: openAccordions["certs"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    />
                  </button>
                  {openAccordions["certs"] && (
                    <div className={styles.policyAccordionContent}>
                      <p style={{ margin: "0 0 10px 0" }}>
                        All structural welds undergo Non-Destructive Testing (NDT) and magnetic particle inspection to ensure maximum join strength. Dry Film Thickness (DFT) coating gauges verify protective layer profiles prior to dispatch.
                      </p>
                      <p style={{ margin: 0 }}>
                        Every order includes a complete Quality Assurance Dossier with MTR mill test reports and compliance certificates.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 4: Returns, Refund & Guarantee Policy */}
                <div className={styles.policyAccordionItem}>
                  <button
                    type="button"
                    className={styles.policyAccordionHeader}
                    onClick={() => toggleAccordion("returnsPolicy")}
                  >
                    <span>Returns, Refund &amp; Guarantee Policy</span>
                    <ChevronDown
                      size={20}
                      style={{ transform: openAccordions["returnsPolicy"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    />
                  </button>
                  {openAccordions["returnsPolicy"] && (
                    <div className={styles.policyAccordionContent}>
                      <p style={{ margin: "0 0 10px 0" }}>
                        <strong>Free 30-Day Returns &amp; Replacement:</strong> We stand behind all Saudi Fab Store products. If your order arrives damaged, incomplete, or fails technical verification, return it within 30 days for a 100% full refund or immediate replacement.
                      </p>
                      <p style={{ margin: 0 }}>
                        All returns are inspected at our Dammam logistics hub. Refunds are processed back to your original payment method or B2B account credit within 3 to 5 business days.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 5: Shipping & Logistics Terms */}
                <div className={styles.policyAccordionItem}>
                  <button
                    type="button"
                    className={styles.policyAccordionHeader}
                    onClick={() => toggleAccordion("shippingTerms")}
                  >
                    <span>Shipping &amp; Freight Logistics Terms</span>
                    <ChevronDown
                      size={20}
                      style={{ transform: openAccordions["shippingTerms"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    />
                  </button>
                  {openAccordions["shippingTerms"] && (
                    <div className={styles.policyAccordionContent}>
                      <p style={{ margin: "0 0 10px 0" }}>
                        <strong>Same-Day Dispatch &amp; GCC Freight:</strong> In-stock catalog items ship within 24 to 48 hours directly to job sites across Riyadh, Dammam, Jeddah, and Jubail.
                      </p>
                      <p style={{ margin: 0 }}>
                        Heavy freight containers and custom structural assemblies ship with dedicated crane offloading options. Free pickup is available at our Dammam Industrial City factory yard.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 6: About Saudi Fab Store */}
                <div className={styles.policyAccordionItem}>
                  <button
                    type="button"
                    className={styles.policyAccordionHeader}
                    onClick={() => toggleAccordion("aboutCompany")}
                  >
                    <span>About Saudi Fab Store &amp; Manufacturing Hub</span>
                    <ChevronDown
                      size={20}
                      style={{ transform: openAccordions["aboutCompany"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    />
                  </button>
                  {openAccordions["aboutCompany"] && (
                    <div className={styles.policyAccordionContent}>
                      <p style={{ margin: "0 0 10px 0" }}>
                        <strong>Saudi Fab Store</strong> is Saudi Arabia&apos;s premier industrial B2B fabrication platform, operating state-of-the-art manufacturing facilities in Dammam Industrial City. We specialize in SASO-certified steel fabrication, forklift attachments, safety enclosures, warehouse storage equipment, and heavy site hardware.
                      </p>
                      <p style={{ margin: 0 }}>
                        Our engineering team provides custom shop drawings, mill test certificates (MTR), and rapid turnarounds for mega-projects across KSA and the GCC.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 7: Terms & Conditions */}
                <div className={styles.policyAccordionItem}>
                  <button
                    type="button"
                    className={styles.policyAccordionHeader}
                    onClick={() => toggleAccordion("termsConditions")}
                  >
                    <span>Terms &amp; Conditions &amp; Commercial Compliance</span>
                    <ChevronDown
                      size={20}
                      style={{ transform: openAccordions["termsConditions"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    />
                  </button>
                  {openAccordions["termsConditions"] && (
                    <div className={styles.policyAccordionContent}>
                      <p style={{ margin: "0 0 10px 0" }}>
                        <strong>Commercial Terms:</strong> All sales are subject to Saudi Fab Store standard commercial terms. Prices are quoted in SAR and include 15% KSA VAT where applicable. Official tax invoices are issued upon dispatch.
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>Warranty &amp; Compliance:</strong> Structural items carry a 1-year manufacturer warranty covering welds and materials. Bulk B2B orders can be billed via corporate credit or site PO terms.
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

            {/* 3. RIGHT WALMART BUY BOX COLUMN */}
            <div className={styles.buyBoxCol}>
              
              <div className={styles.buyBoxCard}>
                
                {/* Price Header */}
                <div className={styles.priceHeaderBlock}>
                  <div className={styles.priceOnlineNotice}>
                    <span>Price when purchased online</span>
                    <button type="button" className={styles.infoTooltipBtn} title="Direct online factory pricing">
                      <HugeiconsIcon icon={InformationSquareIcon} size={14} strokeWidth={2.2} />
                    </button>
                  </div>
                  {/* Price Row with Discount Savings Badge container on the right */}
                  <div className={styles.priceNowRow} style={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                    <div className={styles.priceSuperRow}>
                      <span className={styles.priceSuperCurrency} style={{ display: "inline-flex", alignItems: "center" }}>
                        <HugeiconsIcon icon={SaudiRiyalIcon} size={18} strokeWidth={2.2} />
                      </span>
                      <span className={styles.priceMainInteger}>{Math.floor(currentPrice).toLocaleString()}</span>
                      <sup className={styles.priceSuperCents}>.{(currentPrice % 1).toFixed(2).substring(2) || "00"}</sup>
                    </div>

                    {/* Dynamic Zero-Padding Left-Aligned Discount Savings Badge */}
                    {isDiscounted && (
                      <div style={{
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "2px",
                        padding: 0,
                        margin: 0
                      }}>
                        <span style={{
                          backgroundColor: "#166534",
                          color: "#ffffff",
                          padding: "4px 7px 2px 7px",
                          borderRadius: "4px",
                          fontSize: "10.5px",
                          fontWeight: "900",
                          lineHeight: "1",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center"
                        }}>
                          {purchaseMode === "subscribe" && selectedSwatch === "bulk" ? "SAVE 23.5%" : purchaseMode === "subscribe" ? "SAVE 10%" : "SAVE 15%"}
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "#166534", lineHeight: "1.1" }}>
                          {purchaseMode === "subscribe" ? "Contract Savings" : "Bulk Pack Savings"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Buy Box Tax Information Line - Exactly matching Price when purchased online style */}
                  <div className={styles.priceOnlineNotice} style={{ marginTop: "3px" }}>
                    <span>KSA VAT Included &amp; Tax Invoice Eligible</span>
                  </div>
                </div>

                {/* Primary Action Button: Full-Width Add to Cart Pill (Walmart Blue) */}
                <button
                  type="button"
                  className={styles.fullWidthAddToCartBtn}
                  onClick={handleAddToCart}
                >
                  <HugeiconsIcon icon={ShoppingCart01Icon} size={18} strokeWidth={2.2} />
                  <span>Add to cart</span>
                </button>

                {/* Secondary Action Button: Full-Width Instant Order Pill (Saudi Fab Yellow) */}
                <button
                  type="button"
                  className={styles.secondaryBuyNowBtn}
                  onClick={handleInstantCheckout}
                >
                  <HugeiconsIcon icon={DeliveryBox01Icon} size={18} strokeWidth={2.2} />
                  <span>Buy Now</span>
                </button>

                {/* Purchase Mode Radio Boxes (Only shown if subscription is enabled in product admin) */}
                {product.enableSubscription !== false && (
                  <div className={styles.purchaseOptionsContainer}>
                    
                    {/* Option 1: Subscribe & Save */}
                    <div
                      className={`${styles.optionRadioBox} ${purchaseMode === "subscribe" ? styles.selectedRadioBox : ""}`}
                      onClick={() => setPurchaseMode("subscribe")}
                    >
                      <input
                        type="radio"
                        name="pMode"
                        checked={purchaseMode === "subscribe"}
                        onChange={() => setPurchaseMode("subscribe")}
                        className={styles.radioInputDot}
                      />
                      <div className={styles.optionTextGroup}>
                        <div className={styles.optionTitleRow}>
                          <span className={styles.optionTitleText}>Contract Monthly Auto-Restock</span>
                          <span className={styles.optionPriceText} style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                            <HugeiconsIcon icon={SaudiRiyalIcon} size={12} strokeWidth={2.0} />{(basePrice * 0.9).toFixed(2)}
                          </span>
                        </div>
                        <span className={styles.optionSubText}>Save {product.subscriptionDiscountPercent || 10}% on recurring site supplies</span>
                      </div>
                    </div>

                    {/* Option 2: One-time purchase */}
                    <div
                      className={`${styles.optionRadioBox} ${purchaseMode === "one-time" ? styles.selectedRadioBox : ""}`}
                      onClick={() => setPurchaseMode("one-time")}
                    >
                      <input
                        type="radio"
                        name="pMode"
                        checked={purchaseMode === "one-time"}
                        onChange={() => setPurchaseMode("one-time")}
                        className={styles.radioInputDot}
                      />
                      <div className={styles.optionTextGroup}>
                        <div className={styles.optionTitleRow}>
                          <span className={styles.optionTitleText}>One-time purchase</span>
                          <span className={styles.optionPriceText} style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                            <HugeiconsIcon icon={SaudiRiyalIcon} size={12} strokeWidth={2.0} />{basePrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Fulfillment Method Selector Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#111111" }}>How you&apos;ll get this item:</span>
                  
                  <div className={styles.fulfillmentGrid}>
                    
                    {/* Shipping */}
                    <div
                      className={`${styles.fulfillmentCard} ${fulfillmentMethod === "shipping" ? styles.selectedFulfillmentCard : ""}`}
                      onClick={() => setFulfillmentMethod("shipping")}
                    >
                      <HugeiconsIcon icon={DeliveryTruck01Icon} size={20} strokeWidth={2.2} color={fulfillmentMethod === "shipping" ? "#111111" : "#475569"} />
                      <span className={styles.fulfillmentTitle}>Shipping</span>
                      <span className={styles.fulfillmentSub}>Arrives in 1-2 days</span>
                    </div>

                    {/* Pickup (Disabled) */}
                    <div
                      className={styles.fulfillmentCard}
                      style={{ opacity: 0.5, cursor: "not-allowed", pointerEvents: "none", backgroundColor: "#f8fafc" }}
                      title="Store Pickup currently unavailable"
                    >
                      <HugeiconsIcon icon={Store01Icon} size={20} strokeWidth={2.2} color="#94a3b8" />
                      <span className={styles.fulfillmentTitle} style={{ color: "#94a3b8" }}>Pickup</span>
                      <span className={styles.fulfillmentSub} style={{ color: "#94a3b8" }}>Unavailable</span>
                    </div>

                  </div>
                </div>

                {/* Enhanced Fulfillment & Delivery Information Block */}
                <div className={styles.fulfillmentDetailsBox}>
                  <div className={styles.fulfillmentDetailRow}>
                    <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={2.2} className={styles.fulfillmentDetailIcon} />
                    <div>
                      <span>Ships to <span className={styles.shipsToLocation}>Dammam Industrial City, KSA</span></span>
                    </div>
                  </div>

                  <div style={{ height: "1px", backgroundColor: "#e2e8f0", margin: "2px 0" }} />

                  <div className={styles.fulfillmentDetailRow}>
                    <HugeiconsIcon icon={AnvilIcon} size={16} strokeWidth={2.2} className={styles.fulfillmentDetailIcon} />
                    <div>
                      <span>Sold and shipped by <strong>Saudi Fab Store Direct</strong></span>
                      <br />
                      <Link href="/contact?topic=report_issue" className={styles.fulfillmentDetailLink}>Report an issue with seller or item</Link>
                    </div>
                  </div>

                  <div className={styles.fulfillmentDetailRow}>
                    <HugeiconsIcon icon={DeliveryReturn02Icon} size={16} strokeWidth={2.2} className={styles.fulfillmentDetailIcon} />
                    <div>
                      <span><strong>Free 30-day site returns</strong></span>
                      <Link href="/terms?tab=returns" className={styles.fulfillmentDetailLink}>Details</Link>
                    </div>
                  </div>

                  <div className={styles.fulfillmentDetailRow}>
                    <HugeiconsIcon icon={CheckmarkSquare01Icon} size={16} strokeWidth={2.2} className={styles.fulfillmentDetailIcon} />
                    <div>
                      <span>This item is <strong>B2B VAT Invoice &amp; MTR Certificate eligible</strong></span>
                      <Link href="/terms?tab=purchasing" className={styles.fulfillmentDetailLink}>Learn more</Link>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </main>

      {/* "Frequently Bought Together & Recommended Gear" Intelligent Cross-Sell Carousel Section */}
      {(() => {
        const allAvailableProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;
        const currentId = product?._id;
        const currentCat = (product?.category || "").trim().toLowerCase();

        // 1. Same category products (excluding current item)
        const sameCategoryProducts = allAvailableProducts.filter(
          (p: any) => p._id !== currentId && p.category && p.category.trim().toLowerCase() === currentCat
        );

        // 2. Intelligent ranking for other category products (excluding current item & same category)
        const otherCategoryProducts = allAvailableProducts.filter(
          (p: any) => p._id !== currentId && (!p.category || p.category.trim().toLowerCase() !== currentCat)
        );

        const sortedOtherProducts = [...otherCategoryProducts].sort((a: any, b: any) => {
          const scoreA = (a.isFeatured ? 5 : 0) + (a.badge === 'BESTSELLER' ? 3 : 0);
          const scoreB = (b.isFeatured ? 5 : 0) + (b.badge === 'BESTSELLER' ? 3 : 0);
          return scoreB - scoreA;
        });

        // Take 3-4 top complementary products from other categories
        const complementaryOtherProducts = sortedOtherProducts.slice(0, 4);

        // 3. Combined List: Same Category products FIRST + 3-4 Complementary Products from OTHER categories
        const carouselProducts = [...sameCategoryProducts, ...complementaryOtherProducts];

        return (
          <WalmartPopularCarouselSection
            title="Frequently Bought Together & Recommended Gear"
            subhead={`Same-category items & complementary industrial gear for your order`}
            products={carouselProducts}
          />
        );
      })()}

      {/* Navigating industrial categories on Saudi Fab Store & Terms & Conditions Section */}
      <AboutTermsFooterSection />

      <Footer />
    </div>
  );
}