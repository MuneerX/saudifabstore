"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, TrendingUp } from "lucide-react";
import { INITIAL_PRODUCTS, ProductData } from "@/lib/data/initialProducts";
import styles from "./SearchModal.module.css";

const POPULAR_TAGS = [
  "Forklift Single-Fork Hook",
  "Man Basket",
  "Steel Pallet",
  "Safety Bollard",
  "Hopper",
  "Sandblasting",
  "ProTorc"
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<ProductData[]>(INITIAL_PRODUCTS);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Fetch live products directly from database API
    fetch("/api/products?limit=100")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.products && data.products.length > 0) {
          const apiProds: ProductData[] = data.products.map((p: any) => ({
            _id: p._id || p.id,
            name: p.name,
            description: p.description || "",
            price: p.price || 0,
            category: p.category || "Industrial Product",
            brand: p.brand || "Saudi Fab Store",
            images: p.images && p.images.length > 0 ? p.images : ["/images/home/category_grid/warehouse.jpeg"],
            stock: p.stock || 10,
            isFeatured: true,
            rating: p.rating || 5
          }));
          
          // Use live database products, falling back to initial catalog if merged
          const existingIds = new Set(apiProds.map((p) => p._id));
          const fallbackProducts = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p._id));
          setAllProducts([...apiProds, ...fallbackProducts]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const filteredProducts = query.trim()
    ? allProducts.filter((product) => {
        const q = query.toLowerCase().trim();
        return (
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/products?search=${encodeURIComponent(tag)}`);
    onClose();
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Search Header Input */}
        <form onSubmit={handleSubmit} className={styles.searchHeader}>
          <Search size={22} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Search industrial products, steel works, equipment..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
          <span className={styles.escBadge}>ESC</span>
        </form>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {!query.trim() ? (
            <div>
              <div className={styles.sectionTitle}>
                <TrendingUp size={12} style={{ display: "inline", marginRight: "6px" }} />
                Popular Searches
              </div>
              <div className={styles.tagsRow}>
                {POPULAR_TAGS.map((tag, idx) => (
                  <button
                    key={idx}
                    className={styles.tagPill}
                    onClick={() => handleTagClick(tag)}
                  >
                    <span>{tag}</span>
                  </button>
                ))}
              </div>

              <div className={styles.sectionTitle}>Featured Equipment</div>
              <div className={styles.resultsGrid}>
                {allProducts.slice(0, 4).map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className={styles.resultCard}
                    onClick={onClose}
                  >
                    <div className={styles.resultImgWrapper}>
                      <Image
                        src={product.images[0] || "/images/home/category_grid/warehouse.jpeg"}
                        alt={product.name}
                        fill
                        className={styles.resultImg}
                        sizes="56px"
                      />
                    </div>
                    <div className={styles.resultInfo}>
                      <span className={styles.resultName}>{product.name}</span>
                      <div className={styles.resultMeta}>
                        <span className={styles.resultCategory}>{product.category}</span>
                        <span className={styles.resultPrice}>${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <ArrowRight className={styles.resultArrow} size={16} />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.sectionTitle}>
                Instant Results ({filteredProducts.length})
              </div>
              {filteredProducts.length > 0 ? (
                <div className={styles.resultsGrid}>
                  {filteredProducts.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      className={styles.resultCard}
                      onClick={onClose}
                    >
                      <div className={styles.resultImgWrapper}>
                        <Image
                          src={product.images[0] || "/images/home/category_grid/warehouse.jpeg"}
                          alt={product.name}
                          fill
                          className={styles.resultImg}
                          sizes="56px"
                        />
                      </div>
                      <div className={styles.resultInfo}>
                        <span className={styles.resultName}>{product.name}</span>
                        <div className={styles.resultMeta}>
                          <span className={styles.resultCategory}>{product.category}</span>
                          <span className={styles.resultPrice}>${product.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <ArrowRight className={styles.resultArrow} size={16} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.noResults}>
                  No products found for &ldquo;{query}&rdquo;. Press Enter to view all search results.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={styles.searchFooter}>
          <span className={styles.footerText}>
            Showing results for Saudi Fab Store Products &amp; Equipment
          </span>
          <Link
            href={`/products${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`}
            className={styles.viewAllLink}
            onClick={onClose}
          >
            <span>View All Shop Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}

