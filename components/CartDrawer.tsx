"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "./CartContext";
import styles from "./CartDrawer.module.css";
import { LegalModal, LegalTab } from "./LegalModal";

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateCart, removeFromCart, addToCart } = useCartContext();
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [recProducts, setRecProducts] = useState<any[]>([]);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>("terms");

  // Drag to scroll refs and state for recommendations list
  const recListRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const items = cart?.items || [];
  const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  const subtotal = items.reduce((sum: number, item: any) => {
    const price = typeof item.product?.price === "number" ? item.product.price : parseFloat(item.product?.price) || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  // Fetch recommendation products for "Maybe you would like" section
  useEffect(() => {
    fetch('/api/products?limit=5')
      .then(res => res.json())
      .then(data => {
        if (data && data.products) {
          setRecProducts(data.products);
        }
      })
      .catch(err => console.error("Failed to fetch recommendation products:", err));
  }, []);

  // Drag-to-scroll event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!recListRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - recListRef.current.offsetLeft);
    setScrollLeft(recListRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !recListRef.current) return;
    e.preventDefault();
    const x = e.pageX - recListRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    recListRef.current.scrollLeft = scrollLeft - walk;
  };

  // Format today's or tomorrow's dispatch date (e.g. August 11, 2026)
  const dispatchDateFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  // Prevent background scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Backdrop Overlay */}
      {isCartOpen && (
        <div className={styles.cartOverlay} onClick={closeCart} aria-label="Close cart overlay" />
      )}

      {/* Slide-over Cart Sidebar */}
      <div className={`${styles.cartSidebar} ${isCartOpen ? styles.cartSidebarOpen : ''}`}>
        {/* Header */}
        <div className={styles.cartHeader}>
          <div className={styles.headerTitleGroup}>
            <h2 className={styles.cartTitle}>Your cart</h2>
            <span className={styles.cartItemCount}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div
            className={styles.closeBox}
            onClick={closeCart}
            role="button"
            tabIndex={0}
            aria-label="Close cart"
          >
            <span className={styles.closeText}>Close</span>
            <span className={styles.closeSymbol}>×</span>
          </div>
        </div>

        {/* Scrollable Cart Items Body */}
        <div className={styles.cartBody}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>Your cart is empty</h3>
              <p className={styles.emptySubtext}>
                Explore our catalog of structural steel, equipment attachments, and industrial hardware.
              </p>
              <Link href="/products" className={styles.browseBtn} onClick={closeCart}>
                Browse catalog
              </Link>
            </div>
          ) : (
            items.map((item: any, idx: number) => {
              const productId = item.product?._id || item.product?.id || `item-${idx}`;
              const imageSrc = item.product?.images?.[0] || "/images/home/category_grid/container_3.jpeg";
              const price = typeof item.product?.price === "number" ? item.product.price : parseFloat(item.product?.price) || 0;

              return (
                <div key={item._id || `${productId}-${idx}`} className={styles.cartItemRow}>
                  {/* Square Image Box */}
                  <div className={styles.itemImgBox}>
                    <Image
                      src={imageSrc}
                      alt={item.product?.name || "Product"}
                      fill
                      sizes="(max-width: 768px) 160px, 200px"
                      quality={95}
                      className={styles.itemImg}
                    />
                  </div>

                  {/* Details Column */}
                  <div className={styles.itemContent}>
                    <div className={styles.itemTopLine}>
                      <Link
                        href={`/products/${productId}`}
                        className={styles.itemName}
                        onClick={closeCart}
                      >
                        {item.product?.name || "Viva"}
                      </Link>
                      <span className={styles.itemPrice}>€{price.toFixed(0)}</span>
                    </div>

                    <span className={styles.itemVariant}>
                      {item.size && item.size !== 'Regular' ? item.size : (item.color && item.color !== 'Default Color' ? item.color : "Bubble Gum")}
                    </span>

                    {/* Quantity & Remove Link Row */}
                    <div className={styles.itemControlsRow}>
                      <div className={styles.qtyBox}>
                        <button
                          className={styles.qtyButton}
                          onClick={() => updateCart(productId, Math.max(0, item.quantity - 1))}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className={styles.qtyNum}>{item.quantity}</span>
                        <button
                          className={styles.qtyButton}
                          onClick={() => updateCart(productId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className={styles.removeLink}
                        onClick={() => removeFromCart(productId)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Docked Section: Ticket Strip Separator + Drag Recommendations + Payment Icons */}
        <div className={styles.dockedMiddleSection}>
          {/* Ticket Strip Dotted Line */}
          <div className={styles.ticketDottedLine} />

          {/* "Maybe you would like" Drag Carousel Section */}
          <div className={styles.recommendationsSection}>
            <h3 className={styles.recHeadline}>Maybe you would like</h3>
            <div
              ref={recListRef}
              className={`${styles.recList} ${isMouseDown ? styles.recListGrabbing : ''}`}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {(recProducts.length > 0 ? recProducts : [
                { _id: "rec1", name: "Viva Heavy Attachment", price: 150, color: "Mossy Green", images: ["/images/home/category_grid/container_3.jpeg"] },
                { _id: "rec2", name: "Safety Bollard Yellow Post", price: 190, color: "Yellow Safety", images: ["/images/home/category_grid/safety_3.jpeg"] },
                { _id: "rec3", name: "Industrial Crane Hook Girder", price: 340, color: "Steel Blue", images: ["/images/home/category_grid/lifting_3.jpeg"] }
              ]).map((rec: any, i: number) => {
                const recImage = rec.images?.[0] || "/images/home/category_grid/container_3.jpeg";
                return (
                  <div key={rec._id || i} className={styles.recCard}>
                    <div className={styles.recImgBox}>
                      <Image
                        src={recImage}
                        alt={rec.name}
                        fill
                        sizes="140px"
                        quality={95}
                        className={styles.recImg}
                      />
                    </div>
                    <div className={styles.recContent}>
                      <div className={styles.recContentTop}>
                        <div className={styles.recTitleGroup}>
                          <h4 className={styles.recName} title={rec.name}>{rec.name}</h4>
                          <span className={styles.recPrice}>€{rec.price || 150}</span>
                        </div>
                        <button
                          className={styles.recAddBtn}
                          onClick={() => addToCart(rec._id, 1)}
                          type="button"
                        >
                          Add
                        </button>
                      </div>
                      <div className={styles.recContentBottom}>
                        <span className={styles.recVariant} title={rec.category || rec.color}>
                          {rec.category || rec.color || "Forklift Attachments"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method Badges Container */}
          <div className={styles.paymentSectionContainer}>
            <div className={styles.paymentLogosGrid}>
              {/* Visa */}
              <Image src="/images/visa.svg" alt="Visa" width={48} height={30} className={`${styles.paymentBadgeImg} ${styles.visaLogo}`} unoptimized />
              {/* Mastercard */}
              <Image src="/images/mastercard.png" alt="Mastercard" width={48} height={30} className={styles.paymentBadgeImg} unoptimized />
              {/* Apple Pay */}
              <Image src="/images/applepay.png" alt="Apple Pay" width={48} height={30} className={styles.paymentBadgeImg} unoptimized />
              {/* Google Pay */}
              <Image src="/images/gpay.png" alt="Google Pay" width={48} height={30} className={styles.paymentBadgeImg} unoptimized />
              {/* Amazon Pay */}
              <Image src="/images/Amazon_Pay_logo.svg" alt="Amazon Pay" width={48} height={30} className={styles.paymentBadgeImg} unoptimized />
            </div>
          </div>
        </div>

        {/* Footer Area with Grey Background & Request Quote Style Blue Checkout CTA */}
        <div className={styles.cartFooter}>
          <div className={styles.dispatchRow}>
            <span className={styles.dispatchLabel}>Dispatch</span>
            <span className={styles.dispatchDate}>{dispatchDateFormatted}</span>
          </div>

          <div className={styles.termsRow}>
            <input
              type="checkbox"
              id="cartTermsCheckbox"
              className={styles.checkboxInput}
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <label htmlFor="cartTermsCheckbox" className={styles.termsLabel}>
              I agree to the{" "}
              <button
                type="button"
                className={styles.termsLink}
                style={{ background: "none", border: "none", padding: 0, textDecoration: "underline", cursor: "pointer", font: "inherit" }}
                onClick={(e) => {
                  e.preventDefault();
                  setLegalModalTab("terms");
                  setLegalModalOpen(true);
                }}
              >
                Terms and Conditions
              </button>
            </label>
          </div>

          <Link href="/checkout" className={styles.checkoutCtaCard} onClick={closeCart}>
            <div className={styles.checkoutCtaText}>
              Checkout • €{subtotal.toFixed(0)}
            </div>
            <span className={styles.checkoutCtaArrow}>
              <svg width="10" height="19" viewBox="0 0 10 19" fill="none">
                <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14384 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        defaultTab={legalModalTab}
      />
    </>
  );
}
