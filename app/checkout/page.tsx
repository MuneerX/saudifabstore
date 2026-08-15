"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShieldCheck, Truck, CreditCard, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShopMarquee } from "@/components/ShopMarquee";
import { useCart } from "@/lib/hooks/useCart";
import styles from "./page.module.css";

interface CartItemProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface CartItem {
  product: CartItemProduct;
  quantity: number;
  size: string;
  color: string;
}

interface Cart {
  items: CartItem[];
}

export default function CheckoutPage() {
  const { cart, loading, clearCart } = useCart() as {
    cart: Cart | null;
    loading: boolean;
    clearCart: () => void;
  };

  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "Saudi Arabia",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "invoice">("card");
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorBanner, setErrorBanner] = useState("");

  // Pre-fill user details if logged in
  useEffect(() => {
    if (session?.user) {
      const nameParts = (session.user.name || "").split(" ");
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || nameParts[0] || "",
        lastName: prev.lastName || nameParts.slice(1).join(" ") || "",
        email: prev.email || session.user.email || "",
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const cleanCode = promoCode.trim().toUpperCase();

    if (cleanCode === "BROOQ10" || cleanCode === "WELCOME10") {
      setDiscountAmount(0.1); // 10% off
      setPromoApplied(true);
    } else if (cleanCode === "BROOQ20") {
      setDiscountAmount(0.2); // 20% off
      setPromoApplied(true);
    } else {
      setPromoError("Invalid promo code. Try 'BROOQ10'.");
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner("");

    if (!formData.firstName || !formData.email || !formData.address || !formData.city) {
      setErrorBanner("Please fill out all required shipping fields.");
      return;
    }

    if (paymentMethod === "card" && (!formData.cardNumber || !formData.expiryDate || !formData.cvv)) {
      setErrorBanner("Please fill out all required card details.");
      return;
    }

    setIsProcessing(true);

    try {
      const shippingAddress = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.zipCode || "31952",
        country: formData.country,
      };

      const selectedPaymentMethodTitle = paymentMethod === "card" 
        ? "Credit Card (Mada / Visa)" 
        : "Corporate Purchase Order Invoice";

      // Formulate items for backend submission
      const activeCartItems = cart?.items || [];
      const orderItemsPayload = activeCartItems.map(item => ({
        product: item.product?._id || item.product,
        quantity: item.quantity,
        price: item.product?.price || 10,
      }));

      const orderPayload = {
        shippingAddress,
        paymentMethod: selectedPaymentMethodTitle,
        items: orderItemsPayload,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (response.status === 401) {
        router.push("/login?callbackUrl=/checkout");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Order settlement failed.");
      }

      const result = await response.json();

      // Clear cart
      clearCart();

      // Redirect to purchase complete screen
      const createdOrderId = result.order?._id || result.order?.id || result.order;
      router.push(`/purchase-complete?orderId=${createdOrderId}`);
    } catch (err: any) {
      console.error("Order processing error:", err);
      setErrorBanner(err.message || "An unexpected error occurred during settlement.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Force redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  // Calculate totals
  const cartItemsList = cart?.items || [];
  const subtotal = cartItemsList.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const shippingCost = shippingMethod === "express" ? 45 : (subtotal > 200 ? 0 : 15);
  const discountValue = subtotal * discountAmount;
  const taxAmount = (subtotal - discountValue) * 0.1;
  const netTotal = subtotal - discountValue + shippingCost + taxAmount;

  if (status === "loading" || loading) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar hasBorder={true} isLight={true} />
        <main className={styles.checkoutSection}>
          <div className={styles.checkoutContainer}>
            <div className={styles.mainGrid}>
              <div className={styles.checkoutCard}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonInput}></div>
                <div className={styles.skeletonInput}></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className={styles.pageWrapper}>
        <Navbar hasBorder={true} isLight={true} />
        <main className={styles.checkoutSection}>
          <div className={styles.checkoutContainer}>
            <div className={styles.checkoutCard} style={{ textAlign: "center", alignItems: "center", padding: "60px 24px" }}>
              <Lock size={44} style={{ color: "#EA532B", marginBottom: "12px" }} />
              <h2 className={styles.sectionTitle} style={{ fontSize: "22px", marginBottom: "8px" }}>Sign In Required for Checkout</h2>
              <p className={styles.pageSubtitle} style={{ maxWidth: "460px", marginBottom: "20px" }}>
                Please log in to your account or register to proceed with commercial order settlement and dispatch.
              </p>
              <Link href="/login?callbackUrl=/checkout" className={styles.submitBtn} style={{ maxWidth: "260px", textDecoration: "none" }}>
                Sign In to Proceed
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Light Navbar matching page theme */}
      <Navbar hasBorder={true} isLight={true} showMarquee={true} />

      <main className={styles.checkoutSection}>
        <div className={styles.checkoutContainer}>
          {/* Header Section */}
          <div className={styles.headerSection}>
            <nav className={styles.breadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <ChevronRight size={14} />
              <Link href="/cart" className={styles.breadcrumbLink}>Cart</Link>
              <ChevronRight size={14} />
              <span>Checkout</span>
            </nav>

            <h1 className={styles.pageTitle}>Secure Commercial Checkout</h1>
            <p className={styles.pageSubtitle}>
              Finalize your industrial procurement, select dispatch logistics, and complete secure payment settlement.
            </p>
          </div>

          {/* Form and Summary Grid */}
          <div className={styles.mainGrid}>
            {/* Left Column: Form Details */}
            <div className={styles.checkoutCard}>
              {errorBanner && (
                <div className={styles.errorBanner} role="alert">
                  <AlertCircle size={18} />
                  <span>{errorBanner}</span>
                </div>
              )}

              <form onSubmit={handleSubmitOrder} className={styles.formGrid}>
                {/* Step 1: Shipping Details */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionBadge}>1</span>
                    <h2 className={styles.sectionTitle}>Shipping &amp; Delivery Destination</h2>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.fieldGroup}>
                      <div className={styles.labelRow}>
                        <span className={styles.labelText}>First Name *</span>
                        <span className={styles.dashedConnector} />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        required
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={styles.inputField}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <div className={styles.labelRow}>
                        <span className={styles.labelText}>Last Name *</span>
                        <span className={styles.dashedConnector} />
                      </div>
                      <input
                        type="text"
                        name="lastName"
                        required
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.fieldGroup}>
                      <div className={styles.labelRow}>
                        <span className={styles.labelText}>Work Email Address *</span>
                        <span className={styles.dashedConnector} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.inputField}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <div className={styles.labelRow}>
                        <span className={styles.labelText}>Contact Phone</span>
                        <span className={styles.dashedConnector} />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+966 5X XXX XXXX"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <span className={styles.labelText}>Facility Address *</span>
                      <span className={styles.dashedConnector} />
                    </div>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="Building No, Street Name, Industrial Zone"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.fieldGroup}>
                      <div className={styles.labelRow}>
                        <span className={styles.labelText}>City / Region *</span>
                        <span className={styles.dashedConnector} />
                      </div>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="Dammam / Riyadh / Jubail"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={styles.inputField}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <div className={styles.labelRow}>
                        <span className={styles.labelText}>Postal / ZIP Code</span>
                        <span className={styles.dashedConnector} />
                      </div>
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="31952"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={styles.inputField}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Shipping Options */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionBadge}>2</span>
                    <h2 className={styles.sectionTitle}>Logistics Dispatch Method</h2>
                  </div>

                  <div className={styles.shippingOptions}>
                    <label 
                      className={`${styles.shippingOption} ${shippingMethod === "standard" ? styles.shippingOptionSelected : ""}`}
                      onClick={() => setShippingMethod("standard")}
                    >
                      <div className={styles.shippingInfo}>
                        <input
                          type="radio"
                          name="shippingMethodOption"
                          checked={shippingMethod === "standard"}
                          onChange={() => setShippingMethod("standard")}
                          className={styles.radioInput}
                        />
                        <div>
                          <p className={styles.shippingTitle}>Standard Commercial Freight</p>
                          <p className={styles.shippingSub}>Dispatched in 2-4 business days via regional fleet</p>
                        </div>
                      </div>
                      <span className={styles.shippingPrice}>
                        {subtotal > 200 ? "FREE" : "$15.00"}
                      </span>
                    </label>

                    <label 
                      className={`${styles.shippingOption} ${shippingMethod === "express" ? styles.shippingOptionSelected : ""}`}
                      onClick={() => setShippingMethod("express")}
                    >
                      <div className={styles.shippingInfo}>
                        <input
                          type="radio"
                          name="shippingMethodOption"
                          checked={shippingMethod === "express"}
                          onChange={() => setShippingMethod("express")}
                          className={styles.radioInput}
                        />
                        <div>
                          <p className={styles.shippingTitle}>Express Priority Dispatch</p>
                          <p className={styles.shippingSub}>Dedicated direct vehicle transport within 24 hours</p>
                        </div>
                      </div>
                      <span className={styles.shippingPrice}>$45.00</span>
                    </label>
                  </div>
                </div>

                {/* Step 3: Payment Method */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionBadge}>3</span>
                    <h2 className={styles.sectionTitle}>Payment &amp; Financial Settlement</h2>
                  </div>

                  <div className={styles.paymentTabs}>
                    <button
                      type="button"
                      className={`${styles.paymentTab} ${paymentMethod === "card" ? styles.paymentTabActive : ""}`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard size={18} />
                      Card / Mada Payment
                    </button>
                    <button
                      type="button"
                      className={`${styles.paymentTab} ${paymentMethod === "invoice" ? styles.paymentTabActive : ""}`}
                      onClick={() => setPaymentMethod("invoice")}
                    >
                      <Truck size={18} />
                      B2B Corporate Invoice
                    </button>
                  </div>

                  {paymentMethod === "card" ? (
                    <div className={styles.formGrid}>
                      <div className={styles.fieldGroup}>
                        <div className={styles.labelRow}>
                          <span className={styles.labelText}>Card Number *</span>
                          <span className={styles.dashedConnector} />
                        </div>
                        <input
                          type="text"
                          name="cardNumber"
                          required
                          placeholder="4532 •••• •••• 8921"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={styles.inputField}
                        />
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.fieldGroup}>
                          <div className={styles.labelRow}>
                            <span className={styles.labelText}>Expiry Date *</span>
                            <span className={styles.dashedConnector} />
                          </div>
                          <input
                            type="text"
                            name="expiryDate"
                            required
                            placeholder="MM / YY"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className={styles.inputField}
                          />
                        </div>

                        <div className={styles.fieldGroup}>
                          <div className={styles.labelRow}>
                            <span className={styles.labelText}>CVV / CVC *</span>
                            <span className={styles.dashedConnector} />
                          </div>
                          <input
                            type="text"
                            name="cvv"
                            required
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={styles.inputField}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.errorBanner} style={{ backgroundColor: "#FAF9F5", borderColor: "#EBE7DF", color: "#54514A" }}>
                      <CheckCircle2 size={18} style={{ color: "#EA532B" }} />
                      <span>Corporate Invoice terms selected. An electronic pro-forma invoice will be dispatched to your work email for NET-30 payment processing.</span>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing || cartItemsList.length === 0} 
                  className={styles.submitBtn}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing Commercial Order...
                    </>
                  ) : (
                    <>
                      Confirm &amp; Complete Order (${netTotal.toFixed(2)})
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className={styles.orderSummaryCard}>
              <h2 className={styles.summaryTitle}>
                <span>Order Summary</span>
                <span className={styles.itemsCount}>{cartItemsList.length} items</span>
              </h2>

              <div className={styles.itemList}>
                {cartItemsList.length === 0 ? (
                  <p style={{ color: "#8C887E", fontSize: "14px", margin: "20px 0" }}>Your cart is empty.</p>
                ) : (
                  cartItemsList.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <Image
                        src={item.product?.images?.[0] || "/images/login_bg.jpeg"}
                        alt={item.product?.name || "Product"}
                        width={64}
                        height={64}
                        className={styles.itemThumb}
                        unoptimized
                      />
                      <div className={styles.itemDetails}>
                        <h3 className={styles.itemName}>{item.product?.name}</h3>
                        <p className={styles.itemSpecs}>Spec: {item.size || "Standard"} • {item.color || "Base"}</p>
                        <p className={styles.itemQty}>Qty: {item.quantity}</p>
                      </div>
                      <div className={styles.itemPrice}>
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className={styles.promoBlock}>
                <input
                  type="text"
                  placeholder="Promo code (e.g. BROOQ10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className={styles.promoInput}
                />
                <button type="submit" className={styles.promoBtn}>
                  Apply
                </button>
              </form>

              {promoApplied && (
                <p style={{ color: "#10B981", fontSize: "12.5px", fontWeight: "600", margin: 0 }}>
                  ✓ Promo code applied ({discountAmount * 100}% Discount)
                </p>
              )}
              {promoError && (
                <p style={{ color: "#DC2626", fontSize: "12.5px", margin: 0 }}>
                  {promoError}
                </p>
              )}

              {/* Price Calculation Rows */}
              <div className={styles.calculationRows}>
                <div className={styles.calcRow}>
                  <span>Subtotal</span>
                  <span className={styles.calcRowValue}>${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className={styles.calcRow}>
                    <span>Promo Discount</span>
                    <span className={styles.calcRowValue} style={{ color: "#10B981" }}>
                      -${discountValue.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className={styles.calcRow}>
                  <span>Logistics Shipping</span>
                  <span className={styles.calcRowValue}>
                    {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className={styles.calcRow}>
                  <span>Commercial VAT (10%)</span>
                  <span className={styles.calcRowValue}>${taxAmount.toFixed(2)}</span>
                </div>

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total Settlement</span>
                  <span className={styles.totalValue}>${netTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust & Guarantee Badges */}
              <div className={styles.trustBadges}>
                <div className={styles.trustBadgeItem}>
                  <ShieldCheck size={16} className={styles.trustIcon} />
                  <span>256-bit SSL Encrypted Commercial Transaction</span>
                </div>
                <div className={styles.trustBadgeItem}>
                  <CheckCircle2 size={16} className={styles.trustIcon} />
                  <span>ISO 9001 Quality Inspected &amp; Certified Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}