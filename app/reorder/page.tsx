"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  RotateCcw, 
  Search, 
  ShoppingCart, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Minus,
  Loader2,
  PackageCheck
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartContext } from "@/components/CartContext";
import { INITIAL_PRODUCTS } from "@/lib/data/initialProducts";
import styles from "./page.module.css";

export default function ReorderPage() {
  const { addToCart } = useCartContext();

  const [loading, setLoading] = useState(true);
  const [pastItems, setPastItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "frequent" | "quick">("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReorderItems() {
      setLoading(true);
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          if (data.orders && data.orders.length > 0) {
            // Flatten items from all past orders
            const itemMap: Record<string, any> = {};

            data.orders.forEach((order: any) => {
              const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              (order.orderItems || []).forEach((item: any) => {
                const prod = item.product || {};
                const id = typeof prod === "string" ? prod : (prod._id || prod.id || item._id);
                const name = prod.name || item.name || "Industrial Component";
                const price = prod.price || item.price || 150;
                const image = prod.images?.[0] || prod.image || item.image || "/images/home/category_grid/warehouse.jpeg";
                const category = prod.category || "Structural Fabrication";

                if (!itemMap[id]) {
                  itemMap[id] = {
                    id,
                    name,
                    price,
                    image,
                    category,
                    lastOrdered: orderDate,
                    orderCount: 1,
                    totalQty: item.quantity || 1
                  };
                } else {
                  itemMap[id].orderCount += 1;
                  itemMap[id].totalQty += (item.quantity || 1);
                }
              });
            });

            const uniqueList = Object.values(itemMap);
            setPastItems(uniqueList);

            // Initialize default quantities to 1
            const initialQty: Record<string, number> = {};
            uniqueList.forEach(item => { initialQty[item.id] = 1; });
            setQuantities(initialQty);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load past order items:", err);
      }

      // Fallback sample items from store catalog if no past orders exist
      const fallbackList = INITIAL_PRODUCTS.slice(0, 6).map((prod, idx) => ({
        id: prod._id,
        name: prod.name,
        price: prod.price,
        image: prod.images?.[0] || "/images/home/category_grid/warehouse.jpeg",
        category: prod.category || "Steel Fabrication",
        lastOrdered: `Aug ${15 - idx}, 2026`,
        orderCount: idx % 2 === 0 ? 3 : 1,
        totalQty: (idx + 1) * 2
      }));

      setPastItems(fallbackList);
      const initialQty: Record<string, number> = {};
      fallbackList.forEach(item => { initialQty[item.id] = 1; });
      setQuantities(initialQty);
      setLoading(false);
    }

    fetchReorderItems();
  }, []);

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 1;
      const updated = Math.max(1, Math.min(99, current + delta));
      return { ...prev, [id]: updated };
    });
  };

  const handleReorder = async (item: any) => {
    const qty = quantities[item.id] || 1;
    await addToCart(item.id, qty);
    setAddedSuccessId(item.id);
    setTimeout(() => {
      setAddedSuccessId(null);
    }, 2500);
  };

  // Filter items based on active tab and search query
  const filteredItems = pastItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === "frequent") {
      return item.orderCount > 1 || item.totalQty > 2;
    }
    if (activeTab === "quick") {
      return item.price < 500;
    }
    return true;
  });

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <ChevronRight size={14} />
            <span>Reorder My Items</span>
          </nav>

          {/* Page Header */}
          <div className={styles.headerBlock}>
            <div className={styles.headerTopRow}>
              <div className={styles.titleGroup}>
                <div className={styles.titleRow}>
                  <h1 className={styles.title}>Reorder My Items</h1>
                  <span className={styles.badgeCount}>{pastItems.length} Past Items</span>
                </div>
                <p className={styles.subtitle}>
                  Easily reorder certified structural fabrications, site equipment, and commercial supplies from past purchase orders.
                </p>
              </div>
            </div>

            {/* Filter Tabs & Search Controls */}
            <div className={styles.controlsBar}>
              <div className={styles.tabGroup}>
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`${styles.tabBtn} ${activeTab === "all" ? styles.activeTabBtn : ""}`}
                >
                  All Past Items ({pastItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("frequent")}
                  className={`${styles.tabBtn} ${activeTab === "frequent" ? styles.activeTabBtn : ""}`}
                >
                  Frequently Ordered
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("quick")}
                  className={`${styles.tabBtn} ${activeTab === "quick" ? styles.activeTabBtn : ""}`}
                >
                  Quick Supplies
                </button>
              </div>

              <div className={styles.searchBox}>
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search past ordered items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>
          </div>

          {/* Grid Content */}
          {loading ? (
            <div className={styles.emptyCard} style={{ minHeight: "300px" }}>
              <Loader2 size={36} className="animate-spin" style={{ color: "#0058a3" }} />
              <p style={{ marginTop: "12px", color: "#64748b", fontSize: "14.5px" }}>Loading past items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className={styles.emptyCard}>
              <div className={styles.emptyIconCircle}>
                <PackageCheck size={36} />
              </div>
              <h2 className={styles.emptyTitle}>No Reorder Items Found</h2>
              <p className={styles.emptyDesc}>
                {searchQuery ? `No past orders matching "${searchQuery}".` : "Explore our catalog of certified steel fabrications, material handling equipment, and site hardware to place your first order."}
              </p>
              <Link href="/products" className={styles.browseBtn}>
                <span>Browse Products Catalog</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className={styles.itemsGrid}>
              {filteredItems.map((item) => {
                const qty = quantities[item.id] || 1;
                const isJustAdded = addedSuccessId === item.id;

                return (
                  <div key={item.id} className={styles.itemCard}>
                    <div className={styles.imageBox}>
                      <span className={styles.purchaseTag}>
                        Ordered {item.orderCount} {item.orderCount > 1 ? "times" : "time"}
                      </span>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className={styles.productImg}
                        unoptimized
                      />
                    </div>

                    <div className={styles.cardBody}>
                      <span className={styles.categoryLabel}>{item.category}</span>
                      <h3 className={styles.productTitle}>
                        <Link href={`/products/${item.id}`} className={styles.titleAnchor}>
                          {item.name}
                        </Link>
                      </h3>

                      <div className={styles.metaRow}>
                        <Clock size={13} />
                        <span>Last ordered: {item.lastOrdered}</span>
                      </div>

                      <div className={styles.priceDisplay}>
                        <span>SAR</span>
                        <span style={{ fontSize: "22px" }}>{item.price.toLocaleString()}</span>
                        <sup style={{ fontSize: "13px", top: "-0.4em" }}>.00</sup>
                      </div>

                      <div className={styles.reorderActionBlock}>
                        {/* Quantity Increment/Decrement Controls */}
                        <div className={styles.quantitySelector}>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, -1)}
                            className={styles.qtyBtn}
                            title="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className={styles.qtyVal}>{qty} Unit{qty > 1 ? "s" : ""}</span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, 1)}
                            className={styles.qtyBtn}
                            title="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Saudi Fab Yellow Reorder CTA Button */}
                        <button
                          type="button"
                          onClick={() => handleReorder(item)}
                          className={styles.reorderBtn}
                        >
                          {isJustAdded ? (
                            <>
                              <CheckCircle2 size={18} color="#166534" />
                              <span style={{ color: "#166534" }}>Reordered into Cart!</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw size={16} />
                              <span>Reorder Item</span>
                            </>
                          )}
                        </button>
                      </div>
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
