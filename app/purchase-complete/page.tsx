"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  quantity: number;
  price: number;
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
  isDelivered: boolean;
}

function PurchaseCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const orderData = await response.json();
        setOrder(orderData.order);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleContinueShopping = () => {
    router.push("/products");
  };

  const handleViewOrders = () => {
    router.push("/profile"); // Assuming orders are shown in profile
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar hasBorder={true} />
        <main className="flex-1" style={{ paddingBottom: '256px' }}>
          <div className={styles.successContainer}>
            <div className={styles.successCard}>
              <div className={styles.loadingSpinner}></div>
              <h1 className={styles.successTitle}>Loading...</h1>
            </div>
          </div>
        </main>
        <div style={{ position: 'relative' }}>
          <Footer />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar hasBorder={true} />
        <main className="flex-1" style={{ paddingBottom: '256px' }}>
          <div className={styles.successContainer}>
            <div className={styles.successCard}>
              <div className={styles.errorIcon}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="#ef4444" />
                  <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className={styles.successTitle}>Error</h1>
              <p className={styles.successMessage}>
                {error || 'Something went wrong. Please try again.'}
              </p>
              <div className={styles.actions}>
                <button className={styles.primaryButton} onClick={() => router.push('/')}>
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </main>
        <div style={{ position: 'relative' }}>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar hasBorder={true} />
      <main className="flex-1" style={{ paddingBottom: '256px' }}>
        <div className={styles.successContainer}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="12" fill="#10b981" />
                <path
                  d="M8 12l2 2 4-4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className={styles.successTitle}>Purchase Successful!</h1>

            <p className={styles.successMessage}>
              Thank you for your purchase. Your order has been successfully placed and you will receive a confirmation email shortly.
            </p>

            <div className={styles.orderDetails}>
              <h2>Order Details</h2>
              <div className={styles.detailRow}>
                <span>Order Number:</span>
                <span>#{order._id}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Order Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Estimated Delivery:</span>
                <span>3-5 business days</span>
              </div>
              <div className={styles.detailRow}>
                <span>Payment Method:</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Total Amount:</span>
                <span>₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
              <button
                className={styles.secondaryButton}
                onClick={handleViewOrders}
              >
                View Order History
              </button>
            </div>

            <div className={styles.supportInfo}>
              <p>
                Need help with your order? Contact our support team at{" "}
                <a href="mailto:support@yourstore.com">support@yourstore.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <div style={{ position: 'relative' }}>
        <Footer />
      </div>
    </div>
  );
}

export default function PurchaseCompletePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <Navbar hasBorder={true} />
        <main className="flex-1" style={{ paddingBottom: '256px' }}>
          <div className={styles.successContainer}>
            <div className={styles.successCard}>
              <div className={styles.loadingSpinner}></div>
              <h1 className={styles.successTitle}>Loading...</h1>
            </div>
          </div>
        </main>
        <div style={{ position: 'relative' }}>
          <Footer />
        </div>
      </div>
    }>
      <PurchaseCompleteContent />
    </Suspense>
  );
}