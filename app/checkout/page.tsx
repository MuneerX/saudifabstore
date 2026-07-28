"use client";

import React, { useState } from "react";
import { TopBar } from "@/components/TopBar";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { StayUpToDate } from "@/components/StayUpToDate";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/hooks/useCart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

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

export default function CheckoutPage() {
  // Define the Cart interface, as it's returned by useCart hook
  interface Cart {
    items: CartItem[];
    // Add other properties of the cart object if they exist, e.g., _id, user
  }

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
    email: session?.user?.email || "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Redirect if cart is empty
  React.useEffect(() => {
    if (!loading && (!cart || cart.items.length === 0)) {
      router.push("/cart");
    }
  }, [cart, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Format shipping address for the order
      const shippingAddress = {
        address: formData.address,
        city: formData.city,
        postalCode: formData.zipCode,
        country: formData.country,
      };

      // Format payment method
      const paymentMethod = "Credit Card"; // In a real app, this would come from payment processor

      // Create the order
      const orderData = {
        shippingAddress,
        paymentMethod,
      };

      console.log("Creating order with data:", orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const result = await response.json();
      console.log("Order created successfully:", result);

      // Clear the cart after successful order creation
      clearCart();

      // Redirect to purchase complete page with order details
      router.push(`/purchase-complete?orderId=${result.order._id}`);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar />
        <Navbar hasBorder={true} />
        <main className="flex-1" style={{ paddingBottom: '256px' }}>
          <div className={styles.checkoutContainer}>
            <div className={styles.checkoutForm}>
              <div className={styles.skeletonTitle}></div>

              <div className={styles.form}>
                <div className={styles.formSection}>
                  <div className={styles.skeletonSectionTitle}></div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <div className={styles.skeletonLabel}></div>
                      <div className={styles.skeletonInput}></div>
                    </div>
                    <div className={styles.formGroup}>
                      <div className={styles.skeletonLabel}></div>
                      <div className={styles.skeletonInput}></div>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <div className={styles.skeletonLabel}></div>
                    <div className={styles.skeletonInput}></div>
                  </div>
                  <div className={styles.formGroup}>
                    <div className={styles.skeletonLabel}></div>
                    <div className={styles.skeletonInput}></div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <div className={styles.skeletonLabel}></div>
                      <div className={styles.skeletonInput}></div>
                    </div>
                    <div className={styles.formGroup}>
                      <div className={styles.skeletonLabel}></div>
                      <div className={styles.skeletonInput}></div>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <div className={styles.skeletonLabel}></div>
                    <div className={styles.skeletonInput}></div>
                  </div>
                </div>

                <div className={styles.skeletonButton}></div>
              </div>
            </div>

            <div className={styles.orderSummary}>
              <div className={styles.skeletonSectionTitle}></div>
              <div className={styles.cartItems}>
                {[1, 2].map((i) => (
                  <div key={i} className={styles.cartItem}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.itemDetails}>
                      <div className={styles.skeletonProductTitle}></div>
                      <div className={styles.skeletonProductDetail}></div>
                      <div className={styles.skeletonProductDetail}></div>
                    </div>
                    <div className={styles.skeletonPrice}></div>
                  </div>
                ))}
              </div>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <div className={styles.skeletonLabel}></div>
                  <div className={styles.skeletonValue}></div>
                </div>
                <div className={styles.summaryRow}>
                  <div className={styles.skeletonLabel}></div>
                  <div className={styles.skeletonValue}></div>
                </div>
                <div className={styles.summaryRow}>
                  <div className={styles.skeletonLabel}></div>
                  <div className={styles.skeletonValue}></div>
                </div>
                <div className={styles.summaryRow}>
                  <div className={styles.skeletonLabel}></div>
                  <div className={styles.skeletonValue}></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <div style={{ position: 'relative' }}>
          <StayUpToDate />
          <Footer />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty</div>;
  }

  const subtotal = cart.items.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  );
  const discount = 0;
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Navbar hasBorder={true} />
      <main className="flex-1" style={{ paddingBottom: '256px' }}>
        <div className={styles.checkoutContainer}>
          <div className={styles.checkoutForm}>
            <h1 className={styles.checkoutTitle}>Checkout</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formSection}>
                <h2>Shipping Information</h2>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h2>Payment Information</h2>
                <div className={styles.formGroup}>
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>
            <div className={styles.cartItems}>
              {cart.items.map((item: CartItem) => (
                <div key={item.product._id} className={styles.cartItem}>
                  <Image src={item.product.images[0]} alt={item.product.name} className={styles.itemImage} width={100} height={100} />
                  <div className={styles.itemDetails}>
                    <h3>{item.product.name}</h3>
                    <p>Size: {item.size}, Color: {item.color}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className={styles.itemPrice}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div style={{ position: 'relative' }}>
        <StayUpToDate />
        <Footer />
      </div>
    </div>
  );
}