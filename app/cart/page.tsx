"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartContext } from "@/components/CartContext";
import { LegalModal, LegalTab } from "@/components/LegalModal";
import styles from "./page.module.css";
import { ArrowRight, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const { cart, updateCart, removeFromCart, addToCart } = useCartContext();
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [recProducts, setRecProducts] = useState<any[]>([]);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>("terms");

  const items = cart?.items || [];
  const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  const subtotal = items.reduce((sum: number, item: any) => {
    const price = typeof item.product?.price === "number" ? item.product.price : parseFloat(item.product?.price) || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  useEffect(() => {
    fetch('/api/products?limit=3')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && Array.isArray(data.products)) {
          setRecProducts(data.products);
        }
      })
      .catch(err => console.error("Failed to fetch recommendations:", err));
  }, []);

  const openLegalModal = (tab: LegalTab, e: React.MouseEvent) => {
    e.preventDefault();
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <main className={styles.container}>
        {/* Minimal Header */}
        <div className={styles.cartHeader}>
          <div>
            <h1 className={styles.cartTitle}>
              Shopping Cart
              <span className={styles.cartItemCount}>({itemCount})</span>
            </h1>
          </div>

          <Link href="/products" className={styles.continueShoppingBtn}>
            Continue Shopping &rarr;
          </Link>
        </div>

        {items.length === 0 ? (
          /* Simple Empty State */
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptySubtext}>
              Browse our catalog of structural steel, forklift attachments, and industrial equipment.
            </p>
            <Link href="/products" className={styles.browseBtn}>
              Browse catalog
            </Link>
          </div>
        ) : (
          /* Simple 2-Column Layout */
          <div className={styles.cartGrid}>
            {/* Left Items Column */}
            <div className={styles.mainContent}>
              <div className={styles.itemsList}>
                {items.map((item: any, idx: number) => {
                  const productId = item.product?._id || item.product?.id || `item-${idx}`;
                  const imageSrc = item.product?.images?.[0] || "/images/home/category_grid/warehouse.jpeg";
                  const price = typeof item.product?.price === "number" ? item.product.price : parseFloat(item.product?.price) || 0;

                  return (
                    <div key={item._id || `${productId}-${idx}`} className={styles.cartItemRow}>
                      <div className={styles.itemImgBox}>
                        <Image
                          src={imageSrc}
                          alt={item.product?.name || "Product"}
                          fill
                          sizes="88px"
                          className={styles.itemImg}
                        />
                      </div>

                      <div className={styles.itemContent}>
                        <Link href={`/products/${productId}`} className={styles.itemName}>
                          {item.product?.name || "Industrial Component"}
                        </Link>

                        <span className={styles.itemVariant}>
                          {item.size && item.size !== 'Regular' ? item.size : (item.color && item.color !== 'Default Color' ? item.color : "Standard Specification")}
                        </span>

                        <div className={styles.itemControlsRow}>
                          <div className={styles.qtyBox}>
                            <button
                              type="button"
                              className={styles.qtyButton}
                              onClick={() => updateCart(productId, Math.max(0, item.quantity - 1))}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className={styles.qtyNum}>{item.quantity}</span>
                            <button
                              type="button"
                              className={styles.qtyButton}
                              onClick={() => updateCart(productId, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            type="button"
                            className={styles.removeLink}
                            onClick={() => removeFromCart(productId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className={styles.itemPrice}>
                        SAR {price.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Minimal Recommendations */}
              {recProducts.length > 0 && (
                <div className={styles.recommendationsSection}>
                  <h3 className={styles.recHeadline}>You may also like</h3>

                  <div className={styles.recGrid}>
                    {recProducts.map((rec: any) => {
                      const recImg = rec.images?.[0] || "/images/home/category_grid/warehouse.jpeg";
                      return (
                        <div key={rec._id} className={styles.recCard}>
                          <div className={styles.recImgBox}>
                            <Image
                              src={recImg}
                              alt={rec.name}
                              fill
                              sizes="60px"
                              className={styles.recImg}
                            />
                          </div>

                          <div className={styles.recContent}>
                            <h4 className={styles.recName}>{rec.name}</h4>
                            <span className={styles.recPrice}>SAR {(rec.price || 150).toFixed(2)}</span>
                            <button
                              type="button"
                              className={styles.recAddBtn}
                              onClick={() => addToCart(rec._id, 1)}
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Summary Column */}
            <div className={styles.summaryPanel}>
              <h2 className={styles.summaryTitle}>Summary</h2>

              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span>Subtotal ({itemCount} items)</span>
                  <span className={styles.summaryVal}>SAR {subtotal.toFixed(2)}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span className={styles.freeTag}>FREE</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>VAT (15%)</span>
                  <span className={styles.summaryVal}>SAR {(subtotal * 0.15).toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalAmount}>SAR {subtotal.toFixed(2)}</span>
              </div>

              <div className={styles.termsRow}>
                <input
                  type="checkbox"
                  id="cartTermsCheck"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className={styles.checkboxInput}
                />
                <label htmlFor="cartTermsCheck" className={styles.termsLabel}>
                  I agree to the{" "}
                  <a href="#terms" onClick={(e) => openLegalModal("terms", e)} className={styles.termsLink}>
                    Terms &amp; Conditions
                  </a>
                </label>
              </div>

              <Link href="/checkout" className={styles.checkoutBtn}>
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </Link>

              <div className={styles.paymentLogosGrid}>
                <Image src="/images/visa.svg" alt="Visa" width={32} height={14} className={styles.paymentBadgeImg} unoptimized />
                <Image src="/images/mastercard.png" alt="Mastercard" width={32} height={14} className={styles.paymentBadgeImg} unoptimized />
                <Image src="/images/applepay.png" alt="Apple Pay" width={32} height={14} className={styles.paymentBadgeImg} unoptimized />
                <Image src="/images/gpay.png" alt="Google Pay" width={32} height={14} className={styles.paymentBadgeImg} unoptimized />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
}