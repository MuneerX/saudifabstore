"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, Trash2, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlistContext } from "@/components/WishlistContext";
import { useCartContext } from "@/components/CartContext";
import styles from "./page.module.css";

export default function WishlistPage() {
  const { wishlist, loading, removeFromWishlist, clearWishlist, wishlistCount } = useWishlistContext();
  const { addToCart } = useCartContext();

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <main className={styles.wishlistSection}>
        <div className={styles.container}>
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <ChevronRight size={14} />
            <span>My Wishlist</span>
          </nav>

          {/* Header Block */}
          <div className={styles.headerBlock}>
            <div className={styles.headerTitleGroup}>
              <div className={styles.titleRow}>
                <h1 className={styles.title}>My Saved Wishlist</h1>
                <span className={styles.countBadge}>{wishlistCount} items</span>
              </div>
              <p className={styles.subtitle}>
                Products and equipment saved for your upcoming commercial projects.
              </p>
            </div>

            {wishlistCount > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className={styles.clearAllBtn}
              >
                <Trash2 size={15} />
                Clear Wishlist
              </button>
            )}
          </div>

          {/* Wishlist Content */}
          {loading ? (
            <div className={styles.emptyCard} style={{ minHeight: "300px" }}>
              <Loader2 size={36} className="animate-spin" style={{ color: "#0058a3" }} />
              <p style={{ marginTop: "12px", color: "#64748b", fontSize: "14px" }}>Loading your wishlist...</p>
            </div>
          ) : wishlistCount === 0 ? (
            <div className={styles.emptyCard}>
              <div className={styles.emptyIconWrapper}>
                <Heart size={36} />
              </div>
              <h2 className={styles.emptyTitle}>Your Wishlist is Empty</h2>
              <p className={styles.emptySub}>
                Explore our catalog of structural steel fabrications, heavy material handling skips, and certified industrial equipment to save items for later.
              </p>
              <Link href="/products" className={styles.browseBtn}>
                <span>Browse Products</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {wishlist.map((item: any, idx: number) => {
                const prodId = typeof item === "string" ? item : (item._id || item.id);
                const prodName = item.name || "Industrial Component";
                const prodPrice = typeof item.price === "number" ? item.price : 150;
                const prodImg = item.images?.[0] || item.image || "/images/home/category_grid/warehouse.jpeg";
                const prodCategory = item.category || "Steel Fabrication";

                return (
                  <div key={prodId || idx} className={styles.productCard}>
                    <div className={styles.imgWrapper}>
                      <Image
                        src={prodImg}
                        alt={prodName}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className={styles.productImg}
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(prodId)}
                        className={styles.removeHeartBtn}
                        title="Remove from Wishlist"
                      >
                        <Heart size={18} fill="#dc2626" />
                      </button>
                    </div>

                    <div className={styles.cardContent}>
                      <span className={styles.categoryTag}>{prodCategory}</span>
                      <h3 className={styles.productName}>
                        <Link href={`/products/${prodId}`} className={styles.productNameLink}>
                          {prodName}
                        </Link>
                      </h3>
                      <div className={styles.productPrice}>
                        SAR {prodPrice.toFixed(2)}
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(prodId, 1)}
                        className={styles.addToCartBtn}
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
