"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { StayUpToDate } from "@/components/StayUpToDate";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import { useCart } from "@/lib/hooks/useCart";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  size: string;
  color: string;
}

// Define TypeScript interfaces for Cart
interface Cart {
  items: CartItem[];
  // Add other cart properties if they exist, e.g., _id, user
}

export default function CartPage() {
  const { cart, updateCart, removeFromCart } = useCart() as {
    cart: Cart | null;
    updateCart: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateCart(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const subtotal = cart?.items.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  ) || 0;
  const discount = 0; // For now
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Navbar hasBorder={true} />
      <main className={`flex-1 ${cart?.items && cart.items.length > 0 ? styles.mainContentWithCart : styles.mainContentEmptyCart}`}>
        <div className="page-module__ngZQ_a__cartPage">
          <div className="page-module__ngZQ_a__breadcrumbSection">
            <div className={styles.breadcrumbContainer}>
              <Breadcrumb />
            </div>
          </div>
          <h1 className={styles.cartTitle}>YOUR CART</h1>
          {cart?.items && cart.items.length > 0 ? (
            <div className={styles.cartContainer}>
              <div className={styles.cartItems}>
                {cart.items.map((item: CartItem, index: number) => (
                  <CartItem
                    key={`${item.product._id}-${item.size}-${item.color}-${index}`}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
              <OrderSummary
                subtotal={subtotal}
                discount={discount}
                deliveryFee={deliveryFee}
                total={total}
              />
            </div>
          ) : (
            <EmptyCart />
          )}
        </div>
      </main>
      <div style={{ position: 'relative' }}>
        <StayUpToDate />
        <Footer />
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className={styles.emptyCart}>
      <div className={styles.emptyCartContent}>
        <div className={styles.emptyCartIcon}>
          <ShoppingBag size={80} />
        </div>
        <h2 className={styles.emptyCartTitle}>Your cart is empty</h2>
        <p className={styles.emptyCartDescription}>
          Looks like you have not added any items to your cart yet.
          Start shopping to fill it up!
        </p>
        <Link href="/products" className={styles.continueShoppingButton}>
          <span>Continue Shopping</span>
          <ArrowRight size={20} />
        </Link>
      </div>

      {/* Optional: Add some featured products or suggestions */}
      <div className={styles.emptyCartSuggestions}>
        <h3 className={styles.suggestionsTitle}>Popular Items</h3>
        <div className={styles.suggestionsGrid}>
          <Link href="/products?category=t-shirts" className={styles.suggestionCard}>
            <div className={styles.suggestionImage}>
              <Image
                src="/home/shirt1.png"
                alt="T-Shirts"
                width={60}
                height={60}
                className={styles.suggestionImg}
              />
            </div>
            <span className={styles.suggestionLabel}>T-Shirts</span>
          </Link>
          <Link href="/products?category=hoodies" className={styles.suggestionCard}>
            <div className={styles.suggestionImage}>
              <Image
                src="/home/shirt2.png"
                alt="Hoodies"
                width={60}
                height={60}
                className={styles.suggestionImg}
              />
            </div>
            <span className={styles.suggestionLabel}>Hoodies</span>
          </Link>
          <Link href="/products?category=shorts" className={styles.suggestionCard}>
            <div className={styles.suggestionImage}>
              <Image
                src="/home/shirt3.png"
                alt="Shorts"
                width={60}
                height={60}
                className={styles.suggestionImg}
              />
            </div>
            <span className={styles.suggestionLabel}>Shorts</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className={styles.cartItem}>
      <Image src={item.product.images[0]} alt={item.product.name} className={styles.itemImage} width={100} height={100} />
      <div className={styles.itemDetails}>
        <h3 className={styles.itemName}>{item.product.name}</h3>
        <p className={styles.itemVariant}>
          Size: {item.size}, Color: {item.color}
        </p>
        <div className={styles.quantityControls}>
          <button
            className={styles.quantityButton}
            onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className={styles.quantity}>{item.quantity}</span>
          <button
            className={styles.quantityButton}
            onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      <div className={styles.itemPrice}>
        <p>₹{item.product.price}</p>
        <button
          className={styles.deleteButton}
          onClick={() => onRemove(item.product._id)}
          aria-label="Remove item"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

function Breadcrumb() {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
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
          <span className={styles.breadcrumbCurrent}>Cart</span>
        </li>
      </ol>
    </nav>
  );
}

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function OrderSummary({ subtotal, discount, deliveryFee, total }: OrderSummaryProps) {
  const [coupon, setCoupon] = useState("");
  const router = useRouter();
  const { status } = useSession();

  const handleCheckout = () => {
    if (status === "authenticated") {
      router.push("/checkout"); // Redirect to checkout page
    } else {
      router.push("/login"); // Redirect to login page if not authenticated
    }
  };

  return (
    <div className={styles.orderSummary}>
      <h2 className={styles.summaryTitle}>Order Summary</h2>
      <div className={styles.summaryRow}>
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      <div className={styles.summaryRow}>
        <span>Discount</span>
        <span>-₹{discount.toFixed(2)}</span>
      </div>
      <div className={styles.summaryRow}>
        <span>Delivery Fee</span>
        <span>₹{deliveryFee.toFixed(2)}</span>
      </div>
      <hr className={styles.divider} />
      <div className={styles.summaryRow}>
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
      <div className={styles.couponSection}>
        <input
          type="text"
          placeholder="Add promo code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className={styles.couponInput}
        />
        <button className={styles.applyButton}>Apply</button>
      </div>
      <button className={styles.checkoutButton} onClick={handleCheckout}>Go to Checkout</button>
    </div>
  );
}