"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Factory, ShieldCheck, BadgeCheck, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css"; // Import CSS module
import { useProducts } from "@/lib/hooks/useProducts";
import { useCartContext } from "@/components/CartContext";
import { useParams } from "next/navigation";

const FALLBACK_BADGES = ["BESTSELLER", "BESTSELLER", "BESTSELLER", "LIMITED", "NEW"];
const SAMPLE_SWATCH_SETS = [
  { label: "STEEL FABRICATION", colors: ["#78909c", "#b0bec5", "#37474f", "#eb5521"] },
  { label: "INDUSTRIAL COATINGS", colors: ["#eb5521", "#ffb300", "#1e3a8a", "#212121"] },
  { label: "SMART WOODWORKS", colors: ["#8d6e63", "#5d4037", "#a1887f"] },
  { label: "SAFETY & TRADING", colors: ["#eb5521", "#ffd54f", "#263238"] },
];

export default function ProductDetailsPage() {
  const { id } = useParams(); // Get ID from URL using useParams
  const { getProductById, products, fetchProducts } = useProducts() as any;
  const { addToCart } = useCartContext();
  
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
    specImage?: string;
    category?: string;
  } | null>(null);
  
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('general');

  useEffect(() => {
    const fetchProduct = async () => {
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
        } catch (error) {
          console.error("Failed to fetch product:", error);
          setError("Failed to load product details.");
          setProduct(null);
        }
      }
      setPageLoading(false);
    };

    fetchProduct();
  }, [id, getProductById]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = () => {
    if (product) {
      // Default to quantity 1, Small size, Default Color as per mock-up style
      addToCart(product._id, 1, "Regular", "Default Color");
    }
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordion(prev => prev === index ? null : index);
  };

  // Skeleton component for product detail page matching split-screen layout
  const ProductDetailSkeleton = () => (
    <div className={styles.pageContainer}>
      <Navbar isLight={true} hasBorder={true} />
      <div className={styles.detailSplitLayout}>
        <div className={styles.imageColumn}>
          <div className={styles.imageCard}>
            <div className={styles.skeletonImageWrapper}></div>
          </div>
        </div>
        <div className={styles.infoColumn}>
          <div className={styles.skeletonBadge}></div>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonPrice}></div>
          <div className={styles.skeletonButton}></div>
          <div className={styles.skeletonParagraph}></div>
          <div className={styles.skeletonBullets}></div>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (pageLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className={styles.pageContainer}>
        <Navbar isLight={true} hasBorder={true} />
        <div className={styles.loadingContainer}>
          <div>{error || "Product not found."}</div>
        </div>
        <Footer />
      </div>
    );
  }

  const accordionData = [
    {
      title: "What is the material composition?",
      content: "This product is made from 100% premium quality materials. It's soft, breathable, and designed to maintain its shape and color even after multiple uses/washes."
    },
    {
      title: "How should I care for this item?",
      content: "Clean with mild detergent or wash cold with like colors. Tumble dry low or hang dry. Do not bleach or use harsh chemicals. Handle with care to preserve quality."
    },
    {
      title: "What is the fit like?",
      content: "Regular fit with a comfortable, relaxed silhouette. True to size - we recommend ordering your usual size for the perfect fit."
    },
    {
      title: "Is this product available in other sizes?",
      content: "Yes, this product is available in sizes ranging from Small to XX-Large. All sizes follow our standard dimensions chart."
    },
    {
      title: "Does this product shrink after washing?",
      content: "Our products are pre-treated during manufacturing, so they maintain their size and shape. However, we still recommend following the care instructions for best results."
    },
    {
      title: "Is this product suitable for layering?",
      content: "Yes! The regular fit and high-quality material make it perfect for layering under jackets or coats, or wearing as a standalone piece."
    },
    {
      title: "How long does the color last?",
      content: "We use colorfast dyes and premium finishes that are designed to resist fading. The color and texture vibrancy is maintained through proper care."
    },
    {
      title: "Can I return or exchange this item?",
      content: "Yes, we offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, you can return it for a full refund or exchange within 30 days of delivery."
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <Navbar isLight={true} hasBorder={true} />
 
      <div className={styles.detailSplitLayout}>
        {/* Left Column - Large Centered Image Wrapped in Card */}
        <div className={styles.imageColumn}>
          <div className={styles.imageCard}>
            <Image
              src={product.images?.[0] || '/home/shirt1.png'}
              alt={product.name}
              width={600}
              height={600}
              className={styles.mainProductImage}
              priority
            />
          </div>
        </div>

        {/* Right Column - Product Info Area */}
        <div className={styles.infoColumn}>
          {/* Stock Tag */}
          <div className={styles.badgeWrapper}>
            <span className={styles.stockBadge}>IN STOCK</span>
          </div>

          {/* Product Name */}
          <h1 className={styles.productTitle}>{product.name}</h1>

          {/* Redesigned Integrated Buy Box & Industrial Supply Container */}
          <div className={styles.promoBuyBox}>
            <div className={styles.promoTopRow}>
              <div className={styles.promoLeft}>
                <span className={styles.promoGreenText}>FACTORY DIRECT</span>
                <h4 className={styles.promoHeading}>Direct Manufacturer Rate</h4>
              </div>
              <div className={styles.promoRight}>
                <Image
                  src="/images/iso.svg"
                  alt="ISO Certified Quality"
                  width={52}
                  height={52}
                  className={styles.isoBadgeImage}
                />
              </div>
            </div>

            <div className={styles.promoPriceRow}>
              <div className={styles.priceValue}>
                €{product.price?.toFixed(2)}
              </div>
              <span className={styles.promoBottomText}>Direct factory dispatch & certified mill testing included</span>
            </div>

            <div className={styles.promoDottedLine} />

            {/* Action Buttons inside the Box */}
            <div className={styles.actionButtonsGroup}>
              <button className={styles.buyNowBtn} onClick={handleAddToCart}>
                <svg className={styles.buyNowArrow} width="10" height="19" viewBox="0 0 10 19" fill="none">
                  <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14384 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
                </svg>
                <span>Buy now</span>
              </button>
              <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                <span>Add to cart</span>
              </button>
            </div>
          </div>

          {/* Product Description */}
          <p className={styles.descriptionText}>
            {product.description || "Premium industrial product engineered to the highest standards. Fully compliant with modern structural requirements and load capacities."}
          </p>

          {/* Bullet List */}
          <ul className={styles.bulletList}>
            <li>Precision engineered for heavy-duty applications</li>
            <li>Corrosion-resistant coating for long-lasting durability</li>
            <li>Sustainably sourced premium materials</li>
          </ul>

          {/* Checklist Area */}
          <div className={styles.checklistSection}>
            <div className={styles.checkItem}>
              <span className={styles.checkIcon}>✔</span>
              <span className={styles.checkText}>Direct workshop dispatch & free expedited shipping across KSA</span>
            </div>
            <div className={styles.checkItem}>
              <span className={styles.checkIcon}>✔</span>
              <span className={styles.checkText}>100% Mill test certified & safety load validated</span>
            </div>
            <div className={styles.checkItem}>
              <span className={styles.checkIcon}>✔</span>
              <span className={styles.checkText}>Full in-house engineering support & warranty included</span>
            </div>
          </div>

          {/* Accordion FAQ Area */}
          <div className={styles.accordionsWrapper}>
            {accordionData.map((item, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div key={idx} className={styles.accordionItem}>
                  <button
                    className={styles.accordionHeader}
                    onClick={() => toggleAccordion(idx)}
                  >
                    <span>{item.title}</span>
                    <span className={`${styles.accordionChevron} ${isOpen ? styles.chevronOpen : ''}`}>
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div className={styles.accordionContent}>
                      <p>{item.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Brand Product Tabs Section */}
      <div className={styles.productTabsSection}>
        <div className={styles.tabsHeaderContainer}>
          <button
            className={`${styles.tabHeaderButton} ${activeTab === 'general' ? styles.activeTabButton : styles.inactiveTabButton}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`${styles.tabHeaderButton} ${activeTab === 'specs' ? styles.activeTabButton : styles.inactiveTabButton}`}
            onClick={() => setActiveTab('specs')}
          >
            Specifications
          </button>
          <button
            className={`${styles.tabHeaderButton} ${activeTab === 'quality' ? styles.activeTabButton : styles.inactiveTabButton}`}
            onClick={() => setActiveTab('quality')}
          >
            Quality & Safety
          </button>
        </div>

        <div className={styles.tabContentContainer}>
          {activeTab === 'general' && (
            <div className={styles.tabContentBlock}>
              <div className={styles.specsTabSectionLayout}>
                <div className={styles.specsLeftCol}>
                  <h3 className={styles.specsSectionTitle}>General</h3>
                </div>
                
                <div className={styles.specsRightCol}>
                  {/* Clean Industrial Specification Rail with Premium Icons */}
                  <div className={styles.industrialFactStrip}>
                    <div className={styles.factItem}>
                      <Factory size={15} strokeWidth={1.8} className={styles.factIcon} />
                      <span className={styles.factText}>Dammam Fabrication</span>
                    </div>
                    <div className={styles.factDivider} />
                    <div className={styles.factItem}>
                      <ShieldCheck size={15} strokeWidth={1.8} className={styles.factIcon} />
                      <span className={styles.factText}>1-Year Warranty</span>
                    </div>
                    <div className={styles.factDivider} />
                    <div className={styles.factItem}>
                      <BadgeCheck size={15} strokeWidth={1.8} className={styles.factIcon} />
                      <span className={styles.factText}>ISO 9001:2015</span>
                    </div>
                    <div className={styles.factDivider} />
                    <div className={styles.factItem}>
                      <Star size={15} strokeWidth={1.8} className={styles.factIcon} />
                      <span className={styles.factText}>4.9/5.0 Client Rating</span>
                    </div>
                  </div>

                  {/* Intro Large Paragraph Block */}
                  <div className={styles.introDescriptionBlock}>
                    <p className={styles.introLargeText}>
                      Introducing {product.name}, a premium industrial asset that effortlessly marries structural integrity with custom contracting design. Engineered with high-strength raw materials and treated with protective coating solutions, {product.name} ensures both heavy-duty support and maximum long-term durability for demanding commercial environments. Elevate your operational project setup with Brooq Al Khalij Group.
                    </p>
                    <span className={styles.introDisclaimer}>
                      * Please note that structural sizing and custom configurations are engineered to order requirements.
                    </span>
                  </div>

                  {/* General Table */}
                  <div className={styles.specsTable}>
                    <div className={styles.specsTableRow}>
                      <div className={styles.specsTableLabel}>DIVISION</div>
                      <div className={styles.specsTableValue}>Industrial Engineering & Manufacturing</div>
                    </div>
                    <div className={styles.specsTableRow}>
                      <div className={styles.specsTableLabel}>PRIMARY APPLICATION</div>
                      <div className={styles.specsTableValue}>Commercial, Contracting, and Industrial Operations</div>
                    </div>
                    <div className={styles.specsTableRow}>
                      <div className={styles.specsTableLabel}>DISPATCH &amp; LOGISTICS</div>
                      <div className={styles.specsTableValue}>Direct workshop dispatch &amp; turnkey GCC delivery</div>
                    </div>
                    <div className={styles.specsTableRow}>
                      <div className={styles.specsTableLabel}>QUALITY ASSURANCE</div>
                      <div className={styles.specsTableValue}>100% Mill test certified &amp; traceable carbon grade</div>
                    </div>
                    <div className={styles.specsTableRow}>
                      <div className={styles.specsTableLabel}>ENGINEERING SUPPORT</div>
                      <div className={styles.specsTableValue}>Full in-house structural drafting &amp; consultation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'specs' && (
            <div className={styles.tabContentBlock}>
              <div className={styles.specsTabSectionLayout}>
                <div className={styles.specsLeftCol}>
                  <h3 className={styles.specsSectionTitle}>Specifications</h3>
                </div>
                
                <div className={styles.specsRightCol}>
                  {/* Stock Schematic / Technical Specification Diagram */}
                  <div className={styles.schematicContainer}>
                    <Image
                      src={product.specImage || product.images[0] || "/images/home/about/steel-raw.jpg"}
                      alt={`${product.name} Technical Specification Diagram`}
                      width={600}
                      height={350}
                      unoptimized
                      className={styles.schematicImage}
                    />
                  </div>

                  {/* Specifications Table */}
                  <div className={styles.specsTable}>
                    <div className={styles.specsTableRow}>
                      <div className={styles.specsTableLabel}>MATERIAL</div>
                      <div className={styles.specsTableValue}>ASTM A36 Structural Carbon Steel / Grade A Solid Hardwood</div>
                    </div>
                    <div className={styles.specsTableRow}>
                      <div className={styles.specsTableLabel}>DIMENSIONS</div>
                      <div className={styles.specsTableValue}>H: 120 cm x W: 85 cm x D: 60 cm (Customizable to order requirements)</div>
                    </div>
                    <div className={styles.specsTableRow}>
                      <div className={styles.specsTableLabel}>WEIGHT</div>
                      <div className={styles.specsTableValue}>Approx. 28 kg</div>
                    </div>
                  </div>

                  {/* Three-Column Information Grid */}
                  <div className={styles.infoThreeColGrid}>
                    <div className={styles.infoColItem}>
                      <h4 className={styles.infoColHeader}>FABRICATION DETAILS</h4>
                      <p className={styles.infoColText}>
                        Precision welded and finished entirely in-house at our Dammam facilities. Employs advanced MIG/TIG welding processes to ensure high structural load capacity and structural endurance under extreme mechanical stress.
                      </p>
                    </div>
                    <div className={styles.infoColItem}>
                      <h4 className={styles.infoColHeader}>SURFACE PREPARATION</h4>
                      <p className={styles.infoColText}>
                        Treated with commercial abrasive grit blasting (SA 2.5 profile) to remove all mill scale and oxides, followed immediately by an anti-corrosion epoxy primer and premium polyurethane top coat.
                      </p>
                    </div>
                    <div className={styles.infoColItem}>
                      <h4 className={styles.infoColHeader}>TESTING & CERTIFICATIONS</h4>
                      <p className={styles.infoColText}>
                        Fully tested and certified for safety compliance. Weld connections are non-destructively inspected. DFT (Dry Film Thickness) coating profiles are verified to meet chemical and marine resistance criteria.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Area */}
              <div className={styles.documentsSection}>
                <div className={styles.documentsLeft}>
                  <h3 className={styles.specsSectionTitle}>Documents</h3>
                </div>
                <div className={styles.documentsRight}>
                  <a href="#" className={styles.documentDownloadCard} onClick={(e) => e.preventDefault()}>
                    <span className={styles.documentName}>Technical datasheet & Assembly guide</span>
                    <div className={styles.downloadIconWrapper}>
                      <svg
                        className={styles.downloadIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <polyline points="9 15 12 18 15 15" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'quality' && (
            <div className={styles.tabContentBlock}>
              <div className={styles.specsTabSectionLayout}>
                <div className={styles.specsLeftCol}>
                  <h3 className={styles.specsSectionTitle}>Quality & Safety</h3>
                </div>
                
                <div className={styles.specsRightCol}>
                  {/* Quality Table */}
                  <div className={styles.specsTable}>
                    <div className={styles.specsTableRow}>
                      <div className={styles.specsTableLabel}>WARRANTY</div>
                      <div className={styles.specsTableValue}>1-Year Structural Integrity and Coating adhesion guarantee</div>
                    </div>
                    <div className={styles.specsTableRow}>
                      <div className={styles.specsTableLabel}>COMPLIANCE</div>
                      <div className={styles.specsTableValue}>Fully compliant with Saudi Arabian construction standards and safety regulations</div>
                    </div>
                    <div className={styles.specsTableRow}>
                      <div className={styles.specsTableLabel}>CERTIFICATION</div>
                      <div className={styles.specsTableValue}>ISO 9001:2015 Quality Assurance Certified fabrication processes</div>
                    </div>
                  </div>

                  {/* Three-Column Information Grid */}
                  <div className={styles.infoThreeColGrid}>
                    <div className={styles.infoColItem}>
                      <h4 className={styles.infoColHeader}>WELD INSPECTION</h4>
                      <p className={styles.infoColText}>
                        All structural joins undergo Non-Destructive Testing (NDT) and visual weld verification to confirm maximum load stability.
                      </p>
                    </div>
                    <div className={styles.infoColItem}>
                      <h4 className={styles.infoColHeader}>DFT MONITORING</h4>
                      <p className={styles.infoColText}>
                        Coating layers are verified using digital Dry Film Thickness (DFT) gauges to guarantee specified protective barrier profiles.
                      </p>
                    </div>
                    <div className={styles.infoColItem}>
                      <h4 className={styles.infoColHeader}>RAW MATERIAL TRACE</h4>
                      <p className={styles.infoColText}>
                        All carbon steel mill certificates are fully documented and traceable to maintain material grade consistency.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other Products Section */}
      <div className={styles.otherProductsSection}>
        <div className={styles.otherProductsHeader}>
          <h2 className={styles.otherProductsTitle}>Other Products</h2>
          <p className={styles.otherProductsSubText}>
            Explore more premium fabrication and industrial trading assets from Brooq Al Khalij Group.
          </p>
        </div>

        <div className={styles.otherProductsGrid}>
          {products.filter((p: any) => p._id !== id).slice(0, 4).map((p: any, idx: number) => {
            const badge = FALLBACK_BADGES[idx % FALLBACK_BADGES.length];
            const swatchSet = SAMPLE_SWATCH_SETS[idx % SAMPLE_SWATCH_SETS.length];

            return (
              <Link key={p._id} href={`/products/${p._id}`} className={styles.otherProductCard}>
                <div className={styles.otherProductImageWrapper}>
                  {badge && (
                    <div className={styles.badgePill}>
                      {badge}
                    </div>
                  )}
                  <Image
                    src={p.images?.[0] || "/images/home/category_grid/container_3.jpeg"}
                    alt={p.name}
                    fill
                    className={styles.otherProductImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className={styles.otherProductInfo}>
                  <div className={styles.otherProductTitleRow}>
                    <svg className={styles.otherProductArrowPrefix} width="10" height="19" viewBox="0 0 10 19" fill="none">
                      <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14384 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
                    </svg>
                    <h3 className={styles.otherProductName}>{p.name}</h3>
                  </div>
                  
                  <div className={styles.otherProductPriceRow}>
                    <span className={styles.otherProductPrice}>€{p.price?.toFixed(2)}</span>
                  </div>

                  <div className={styles.otherProductSwatchSection}>
                    <div className={styles.otherProductSwatchLabel}>{swatchSet.label}</div>
                    <div className={styles.otherProductSwatchesRow}>
                      {swatchSet.colors.map((c: string, i: number) => (
                        <span
                          key={i}
                          className={styles.otherProductSwatchDot}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}