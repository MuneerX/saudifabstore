"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight, ShoppingBag, FileText, ArrowRight, Phone, Mail, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

interface OrderItem {
  product?: {
    _id?: string;
    name?: string;
    images?: string[];
    price?: number;
  };
  quantity?: number;
  price?: number;
  size?: string;
  color?: string;
}

interface Order {
  _id: string;
  createdAt: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  orderItems: OrderItem[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  shippingStatus: string;
}

function PurchaseCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to load commercial order record.");
        }
        const orderData = await response.json();
        setOrder(orderData.order);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load commercial order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar hasBorder={true} isLight={true} />
        <main className={styles.successSection}>
          <div className={styles.container}>
            <div className={styles.card}>
              <div className={styles.loadingBox}>
                <Loader2 size={40} className="animate-spin" style={{ color: "#EA532B" }} />
                <h2 className={styles.title}>Loading Order Settlement...</h2>
              </div>
            </div>
          </div>
        </main>
        <Footer noGradient={true} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar hasBorder={true} isLight={true} />
        <main className={styles.successSection}>
          <div className={styles.container}>
            <div className={styles.card}>
              <div className={styles.errorIconWrapper}>
                <AlertCircle size={40} />
              </div>
              <div className={styles.headerBlock}>
                <h1 className={styles.title}>Order Record Not Available</h1>
                <p className={styles.subtitle}>
                  {error || "We couldn't retrieve the specified order details. Please check your account history."}
                </p>
              </div>
              <div className={styles.actionsGroup}>
                <button className={styles.primaryBtn} onClick={() => router.push("/products")}>
                  Return to Product Catalog
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer noGradient={true} />
      </div>
    );
  }

  const itemsList = order.orderItems || [];
  const orderFormattedDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString();

  return (
    <div className={styles.pageWrapper}>
      <Navbar hasBorder={true} isLight={true} />

      <main className={styles.successSection}>
        <div className={styles.container}>
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <ChevronRight size={14} />
            <Link href="/checkout" className={styles.breadcrumbLink}>Checkout</Link>
            <ChevronRight size={14} />
            <span>Order Confirmed</span>
          </nav>

          {/* Main Success Card */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <CheckCircle2 size={44} />
            </div>

            <div className={styles.headerBlock}>
              <h1 className={styles.title}>Order Confirmed &amp; Settlement Received!</h1>
              <p className={styles.subtitle}>
                Thank you for your commercial order with Brooq Al Khalij. Your order has been registered in our dispatch network, and a copy of your commercial receipt has been generated.
              </p>
            </div>

            {/* Commercial Details Box */}
            <div className={styles.detailsBox}>
              <div className={styles.detailsHeader}>
                <span>Order Reference Summary</span>
                <span className={styles.statusBadge}>
                  {order.shippingStatus ? order.shippingStatus.toUpperCase() : "CONFIRMED"}
                </span>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Order Reference ID</span>
                  <span className={styles.detailValue}>#{order._id}</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Order Date</span>
                  <span className={styles.detailValue}>{orderFormattedDate}</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Payment Method</span>
                  <span className={styles.detailValue}>{order.paymentMethod || "Credit Card"}</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Estimated Dispatch</span>
                  <span className={styles.detailValue}>2 - 4 Business Days</span>
                </div>

                <div className={styles.detailRow} style={{ gridColumn: "1 / -1" }}>
                  <span className={styles.detailLabel}>Delivery Destination</span>
                  <span className={styles.detailValue}>
                    {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
                  </span>
                </div>
              </div>

              {/* Items Summary List */}
              {itemsList.length > 0 && (
                <div className={styles.itemsSection}>
                  <p className={styles.itemsSectionTitle}>Purchased Line Items ({itemsList.length})</p>
                  <div className={styles.itemsList}>
                    {itemsList.map((item, idx) => (
                      <div key={idx} className={styles.itemRow}>
                        <div className={styles.itemLeft}>
                          <Image
                            src={item.product?.images?.[0] || "/images/login_bg.jpeg"}
                            alt={item.product?.name || "Product"}
                            width={44}
                            height={44}
                            className={styles.itemThumb}
                            unoptimized
                          />
                          <div>
                            <p className={styles.itemName}>{item.product?.name || "Industrial Item"}</p>
                            <p className={styles.itemQty}>Qty: {item.quantity || 1} • Spec: {item.size || "Standard"}</p>
                          </div>
                        </div>
                        <span className={styles.itemPrice}>
                          ${((item.price || item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.totalSummaryBar}>
                    <span className={styles.totalSummaryLabel}>Total Settlement Paid</span>
                    <span className={styles.totalSummaryValue}>${(order.totalPrice || 0).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className={styles.actionsGroup}>
              <button 
                className={styles.primaryBtn} 
                onClick={() => router.push("/products")}
              >
                <ShoppingBag size={18} />
                Continue Shopping
              </button>
              
              <button 
                className={styles.secondaryBtn}
                onClick={() => router.push("/profile")}
              >
                <FileText size={18} />
                View Order History
              </button>
            </div>

            {/* Direct Support Info */}
            <div className={styles.supportBox}>
              <p className={styles.supportTitle}>Need dispatch assistance or drawing modifications for your order?</p>
              <div className={styles.supportChannels}>
                <a href="mailto:info@brooqalkhalij.com" className={styles.supportChannel}>
                  <Mail size={15} />
                  <span>info@brooqalkhalij.com</span>
                </a>
                <a href="tel:+966138121100" className={styles.supportChannel}>
                  <Phone size={15} />
                  <span>+966 13 812 1100</span>
                </a>
                <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer" className={styles.supportChannel}>
                  <MessageSquare size={15} />
                  <span>WhatsApp Helpdesk</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer noGradient={true} />
    </div>
  );
}

export default function PurchaseCompletePage() {
  return (
    <Suspense
      fallback={
        <div className={styles.pageWrapper}>
          <Navbar hasBorder={true} isLight={true} />
          <main className={styles.successSection}>
            <div className={styles.container}>
              <div className={styles.card}>
                <div className={styles.loadingBox}>
                  <Loader2 size={40} className="animate-spin" style={{ color: "#EA532B" }} />
                  <h2 className={styles.title}>Loading...</h2>
                </div>
              </div>
            </div>
          </main>
          <Footer noGradient={true} />
        </div>
      }
    >
      <PurchaseCompleteContent />
    </Suspense>
  );
}