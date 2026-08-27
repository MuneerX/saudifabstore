"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShieldCheck, Truck, CreditCard, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/hooks/useCart";
import { INITIAL_PRODUCTS } from "@/lib/data/initialProducts";
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

function CheckoutContent() {
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

    if (cleanCode === "FAB10" || cleanCode === "WELCOME10") {
      setDiscountAmount(0.1); // 10% off
      setPromoApplied(true);
    } else if (cleanCode === "FAB20") {
      setDiscountAmount(0.2); // 20% off
      setPromoApplied(true);
    } else {
      setPromoError("Invalid promo code. Try 'FAB10'.");
    }
  };

  const searchParams = useSearchParams();
  const isInstant = searchParams.get("instant") === "true";
  const instantProductId = searchParams.get("productId");
  const instantQty = parseInt(searchParams.get("qty") || "1", 10);
  const instantSwatch = searchParams.get("swatch") || "Single Pack";
  const instantPriceParam = parseFloat(searchParams.get("price") || "0");

  const [instantProduct, setInstantProduct] = useState<any>(null);

  useEffect(() => {
    if (isInstant && instantProductId) {
      const match = INITIAL_PRODUCTS.find(p => p._id === instantProductId || p.name === instantProductId);
      if (match) {
        setInstantProduct(match);
      } else {
        fetch(`/api/products/${instantProductId}`)
          .then(res => res.json())
          .then(data => { if (data.product) setInstantProduct(data.product); })
          .catch(() => {});
      }
    }
  }, [isInstant, instantProductId]);

  const activeCheckoutItems: CartItem[] = isInstant && instantProductId
    ? [
        {
          product: {
            _id: instantProductId,
            name: instantProduct?.name || "Structural Steel Component",
            price: instantPriceParam || instantProduct?.price || 150,
            images: instantProduct?.images || ["/images/home/category_grid/warehouse.jpeg"],
          },
          quantity: instantQty,
          size: instantSwatch,
          color: "SASO Industrial Finish"
        }
      ]
    : (cart?.items || []);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCheckoutItems.length === 0) {
      setErrorBanner("No items selected for settlement.");
      return;
    }

    try {
      setIsProcessing(true);
      setErrorBanner("");

      const shippingAddress = {
        name: `${formData.firstName} ${formData.lastName}`.trim() || session?.user?.name || "Customer",
        email: formData.email || session?.user?.email || "customer@example.com",
        phone: formData.phone || "0500000000",
        address: formData.address,
        city: formData.city,
        postalCode: formData.zipCode || "31952",
        country: formData.country,
      };

      const selectedPaymentMethodTitle = paymentMethod === "card" 
        ? "Credit Card (Mada / Visa)" 
        : "Corporate Purchase Order Invoice";

      const orderItemsPayload = activeCheckoutItems.map(item => ({
        product: item.product?._id || item.product,
        quantity: item.quantity,
        price: item.product?.price || 150,
        size: item.size || "Standard Spec",
        color: item.color || "SASO Industrial Finish",
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
      if (!isInstant) {
        clearCart();
      }
      const createdOrderId = result.order?._id || result.order?.id || result.order;
      router.push(`/purchase-complete?orderId=${createdOrderId}`);
    } catch (err: any) {
      console.error("Order processing error:", err);
      setErrorBanner(err.message || "An unexpected error occurred during settlement.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  // Calculate totals in SAR
  const cartItemsList = activeCheckoutItems;
  const subtotal = cartItemsList.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const shippingCost = shippingMethod === "express" ? 45 : (subtotal > 500 ? 0 : 25);
  const discountValue = subtotal * discountAmount;
  const taxAmount = (subtotal - discountValue) * 0.15; // 15% KSA VAT
  const netTotal = subtotal - discountValue + shippingCost + taxAmount;

  if (status === "loading" || loading) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar />
        <main className={styles.checkoutSection}>
          <div className={styles.checkoutContainer}>
            <div className={styles.mainGrid}>
              <div className={styles.checkoutCard}>
                <p>Loading checkout...</p>
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
        <Navbar />
        <main className={styles.checkoutSection}>
          <div className={styles.checkoutContainer}>
            <div className={styles.checkoutCard} style={{ textAlign: "center", alignItems: "center", padding: "60px 24px" }}>
              <Lock size={40} style={{ color: "#0058a3", marginBottom: "12px" }} />
              <h2 className={styles.sectionTitle} style={{ fontSize: "22px", marginBottom: "8px" }}>Sign In Required for Checkout</h2>
              <p className={styles.pageSubtitle} style={{ maxWidth: "460px", marginBottom: "24px" }}>
                Please log in to your account to complete your commercial order settlement.
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
      <Navbar />

      <main className={styles.checkoutSection}>
        <div className={styles.checkoutContainer}>
          {/* Header Section */}
          <div className={styles.headerSection}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <ChevronRight size={14} />
              <Link href="/cart" className={styles.breadcrumbLink}>Cart</Link>
              <ChevronRight size={14} />
              <span>Checkout</span>
            </nav>

            <h1 className={styles.pageTitle}>Secure Checkout</h1>
            <p className={styles.pageSubtitle}>
              Finalize your shipping destination and payment settlement.
            </p>
          </div>

          {/* Form and Summary Grid */}
          <div className={styles.mainGrid}>
            {/* Left Column: Shipping & Payment Form */}
            <div className={styles.checkoutCard}>
              {errorBanner && (
                <div className={styles.errorBanner} role="alert">
                  <AlertCircle size={18} />
                  <span>{errorBanner}</span>
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className={styles.formGrid}>
                {/* Step 1: Shipping Details */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionBadge}>1</span>
                    <h2 className={styles.sectionTitle}>Shipping &amp; Delivery Destination</h2>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.fieldGroup}>
                      <span className={styles.labelText}>First Name *</span>
                      <input
                        type="text"
                        name="firstName"
                        required
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={styles.inputField}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <span className={styles.labelText}>Last Name *</span>
                      <input
                        type="text"
                        name="lastName"
                        required
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.fieldGroup}>
                      <span className={styles.labelText}>Email Address *</span>
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
                      <span className={styles.labelText}>Phone Number</span>
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
                    <span className={styles.labelText}>Facility / Street Address *</span>
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
                      <span className={styles.labelText}>City / Region *</span>
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
                      <span className={styles.labelText}>Postal Code</span>
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

                {/* Step 2: Shipping Method */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionBadge}>2</span>
                    <h2 className={styles.sectionTitle}>Logistics Dispatch</h2>
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
                          <p className={styles.shippingTitle}>Standard Regional Transport</p>
                          <p className={styles.shippingSub}>Dispatched in 2-3 business days</p>
                        </div>
                      </div>
                      <span className={styles.shippingPrice}>
                        {subtotal > 500 ? "FREE" : "SAR 25.00"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Step 3: Payment Method */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionBadge}>3</span>
                    <h2 className={styles.sectionTitle}>Payment Method</h2>
                  </div>

                  <div className={styles.paymentTabs}>
                    <button
                      type="button"
                      className={`${styles.paymentTab} ${paymentMethod === "card" ? styles.paymentTabActive : ""}`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard size={16} />
                      Card / Mada Payment
                    </button>
                    <button
                      type="button"
                      className={`${styles.paymentTab} ${paymentMethod === "invoice" ? styles.paymentTabActive : ""}`}
                      onClick={() => setPaymentMethod("invoice")}
                    >
                      <Truck size={16} />
                      Corporate B2B Invoice
                    </button>
                  </div>

                  {paymentMethod === "card" ? (
                    <div className={styles.formGrid}>
                      <div className={styles.fieldGroup}>
                        <span className={styles.labelText}>Card Number *</span>
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

                      <div className={styles.formRow2Col}>
                        <div className={styles.fieldGroup}>
                          <span className={styles.labelText}>Expiry Date *</span>
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
                          <span className={styles.labelText}>CVV / CVC *</span>
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
                    <div className={styles.errorBanner} style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0", color: "#475569" }}>
                      <CheckCircle2 size={18} style={{ color: "#16a34a" }} />
                      <span>Corporate Invoice selected. A pro-forma invoice will be dispatched for NET-30 payment processing.</span>
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
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <span>Complete Order (SAR {netTotal.toFixed(2)})</span>
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
                  <p style={{ color: "#64748b", fontSize: "14px", margin: "16px 0" }}>Your cart is empty.</p>
                ) : (
                  cartItemsList.map((item, idx) => {
                    const rawOptionStr = item.size || "Standard Spec";
                    const isSubscribed = rawOptionStr.toLowerCase().includes("auto-restock") || rawOptionStr.toLowerCase().includes("monthly");
                    const displayOption = rawOptionStr.replace(/\(Monthly Auto-Restock.*?\)/gi, '').trim() || "Standard Spec";

                    return (
                      <div key={idx} className={styles.itemRow}>
                        <Image
                          src={item.product?.images?.[0] || "/images/home/category_grid/warehouse.jpeg"}
                          alt={item.product?.name || "Product"}
                          width={56}
                          height={56}
                          className={styles.itemThumb}
                          unoptimized
                        />
                        <div className={styles.itemDetails}>
                          <h3 className={styles.itemName}>{item.product?.name}</h3>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", margin: "2px 0" }}>
                            <span className={styles.itemSpecs}>{displayOption}</span>
                            {isSubscribed && (
                              <span style={{ fontSize: "10.5px", fontWeight: 700, backgroundColor: "#ecfdf5", color: "#047857", padding: "1px 6px", borderRadius: "10px", border: "1px solid #a7f3d0" }}>
                                ↻ Monthly Restock
                              </span>
                            )}
                          </div>
                          <p className={styles.itemQty}>Qty: {item.quantity}</p>
                        </div>
                        <div className={styles.itemPrice}>
                          SAR {((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className={styles.promoBlock}>
                <input
                  type="text"
                  placeholder="Promo code (e.g. FAB10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className={styles.promoInput}
                />
                <button type="submit" className={styles.promoBtn}>
                  Apply
                </button>
              </form>

              {promoApplied && (
                <p style={{ color: "#16a34a", fontSize: "12.5px", fontWeight: "600", margin: 0 }}>
                  ✓ Promo code applied ({discountAmount * 100}% Off)
                </p>
              )}
              {promoError && (
                <p style={{ color: "#dc2626", fontSize: "12.5px", margin: 0 }}>
                  {promoError}
                </p>
              )}

              {/* Price Breakdown */}
              <div className={styles.calculationRows}>
                <div className={styles.calcRow}>
                  <span>Subtotal</span>
                  <span className={styles.calcRowValue}>SAR {subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className={styles.calcRow}>
                    <span>Promo Discount</span>
                    <span className={styles.calcRowValue} style={{ color: "#16a34a" }}>
                      -SAR {discountValue.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className={styles.calcRow}>
                  <span>Shipping</span>
                  <span className={styles.calcRowValue}>
                    {shippingCost === 0 ? "FREE" : `SAR ${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className={styles.calcRow}>
                  <span>VAT (15%)</span>
                  <span className={styles.calcRowValue}>SAR {taxAmount.toFixed(2)}</span>
                </div>

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.totalValue}>SAR {netTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className={styles.trustBadges}>
                <div className={styles.trustBadgeItem}>
                  <ShieldCheck size={16} className={styles.trustIcon} />
                  <span>256-bit SSL Encrypted Transaction</span>
                </div>
                <div className={styles.trustBadgeItem}>
                  <ShieldCheck size={16} className={styles.trustIcon} />
                  <span>SASO &amp; ISO Certified Inspection</span>
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
