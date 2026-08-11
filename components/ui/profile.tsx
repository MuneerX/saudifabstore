"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Building, 
  LogOut, 
  ShoppingBag, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Save, 
  Loader2, 
  Package, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import styles from "./profile.module.css";
import apiClient from "@/lib/apiClient";

interface ProductInfo {
  name: string;
  images: string[];
}

interface OrderItem {
  product: ProductInfo;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: string;
  isPaid: boolean;
  isDelivered: boolean;
  shippingStatus?: 'pending' | 'shipped' | 'delivered';
  shippedAt?: string;
  deliveredAt?: string;
  orderItems: OrderItem[];
  totalPrice: number;
}

interface GetOrdersResponse {
  orders: Order[];
}

const Profile = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User profile data state
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    company: "",
    address: ""
  });

  // Orders state
  const [orders, setOrders] = useState<
    {
      id: string;
      date: string;
      status: string;
      shippedAt?: string;
      deliveredAt?: string;
      items: {
        name: string;
        price: string;
        image: string;
      }[];
      total: string;
    }[]
  >([]);

  // Fetch profile and orders
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        let user = null;
        try {
          const profileResponse = await apiClient.getProfile();
          if (profileResponse && profileResponse.user) {
            user = profileResponse.user;
          }
        } catch (profileErr) {
          console.warn("Using session user fallback:", profileErr);
        }

        const activeUser = user || session?.user || {};
        setUserData({
          name: activeUser.name || session?.user?.name || "Brooq Client",
          email: activeUser.email || session?.user?.email || "",
          company: activeUser.company || "Brooq Industrial Partner",
          address: activeUser.address 
            ? `${activeUser.address.street || ""}, ${activeUser.address.city || ""}, ${activeUser.address.state || ""} ${activeUser.address.zip || ""}`.replace(/^, |, $/, "")
            : ""
        });

        // Fetch user orders safely
        if (session?.user?.id) {
          try {
            const ordersResponse: GetOrdersResponse = await apiClient.request(`/orders?userId=${session.user.id}`);
            if (ordersResponse && Array.isArray(ordersResponse.orders)) {
              const formattedOrders = ordersResponse.orders.map((order: Order) => {
                let status = 'pending';
                if (order.shippingStatus) {
                  status = order.shippingStatus;
                } else if (order.isPaid) {
                  status = order.isDelivered ? 'delivered' : 'shipped';
                }

                return {
                  id: `#${(order._id || '').slice(-6)}`,
                  date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString(),
                  status: status,
                  shippedAt: order.shippedAt ? new Date(order.shippedAt).toLocaleString() : undefined,
                  deliveredAt: order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : undefined,
                  items: (order.orderItems || []).map((item: OrderItem) => ({
                    name: item.product?.name || "Industrial Attachment",
                    price: `€${(item.price || 0).toFixed(0)}`,
                    image: item.product?.images?.[0] || "/images/home/category_grid/container_3.jpeg"
                  })),
                  total: `€${(order.totalPrice || 0).toFixed(0)}`
                };
              });

              setOrders(formattedOrders);
            }
          } catch (ordersErr) {
            console.warn("Could not fetch orders:", ordersErr);
            setOrders([]);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile information.");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveSuccess(false);

      await apiClient.updateProfile({
        name: userData.name,
        email: userData.email
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const initialLetter = userData.name ? userData.name.charAt(0).toUpperCase() : (session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "B");

  if (loading) {
    return (
      <div className={styles.loadingBox}>
        <div className={styles.spinner} />
        <p style={{ color: '#6E6B64', fontSize: '14.5px' }}>Loading your Client Portal profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      {/* Header Banner Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerGlow} />

        <div className={styles.userInfoGroup}>
          <div className={styles.avatarBox}>
            {initialLetter}
          </div>
          <div className={styles.userMeta}>
            <div className={styles.userNameRow}>
              <h1 className={styles.userName}>{userData.name || "Brooq Client"}</h1>
              <span className={styles.clientBadge}>
                <ShieldCheck size={12} style={{ display: 'inline', marginRight: '3px' }} />
                Verified Account
              </span>
            </div>
            <p className={styles.userEmail}>{userData.email || session?.user?.email || "client@brooqalkhalij.com"}</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button 
            type="button"
            className={styles.signOutBtn}
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsBar}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "orders" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <ShoppingBag size={18} />
          Order History {orders.length > 0 && `(${orders.length})`}
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "settings" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <UserIcon size={18} />
          Account Settings
        </button>
      </div>

      {/* Tab Contents */}
      <div className={styles.tabContentSection}>
        {activeTab === "orders" && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Your Purchase & Order History</h2>
            </div>

            {orders.length > 0 ? (
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    {/* Top Row: Order Number & Status */}
                    <div className={styles.orderHeader}>
                      <div className={styles.orderIdGroup}>
                        <Package size={18} color="#0453F8" />
                        <span className={styles.orderId}>{order.id}</span>
                        <span className={styles.orderDate}>• Placed on {order.date}</span>
                      </div>

                      <div className={`${styles.statusBadge} ${
                        order.status === 'delivered' ? styles.statusDelivered : (order.status === 'shipped' ? styles.statusShipped : styles.statusPending)
                      }`}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />
                        {order.status}
                      </div>
                    </div>

                    {/* Order Fulfillment Timeline */}
                    <div className={styles.timelineBox}>
                      <div className={styles.timelineRow}>
                        <div className={styles.timelineStep}>
                          <div className={`${styles.stepIconBox} ${styles.stepIconActive}`}>
                            <CreditCard size={15} />
                          </div>
                          <div className={styles.stepMeta}>
                            <span className={styles.stepTitle}>Payment Confirmed</span>
                            <span className={styles.stepTime}>{order.date}</span>
                          </div>
                        </div>

                        <div className={styles.timelineStep}>
                          <div className={`${styles.stepIconBox} ${order.shippedAt || order.status === 'shipped' || order.status === 'delivered' ? styles.stepIconActive : ''}`}>
                            <Truck size={15} />
                          </div>
                          <div className={styles.stepMeta}>
                            <span className={styles.stepTitle}>Dispatched</span>
                            <span className={styles.stepTime}>{order.shippedAt || "In Preparation"}</span>
                          </div>
                        </div>

                        <div className={styles.timelineStep}>
                          <div className={`${styles.stepIconBox} ${order.deliveredAt || order.status === 'delivered' ? styles.stepIconActive : ''}`}>
                            <CheckCircle2 size={15} />
                          </div>
                          <div className={styles.stepMeta}>
                            <span className={styles.stepTitle}>Delivered</span>
                            <span className={styles.stepTime}>{order.deliveredAt || "Pending Delivery"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Line Items */}
                    <div className={styles.itemsGrid}>
                      {order.items.map((item, idx) => (
                        <div key={idx} className={styles.itemRow}>
                          <div className={styles.itemThumb}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              unoptimized
                              className={styles.itemImg}
                            />
                          </div>
                          <div className={styles.itemDetails}>
                            <span className={styles.itemName}>{item.name}</span>
                            <span className={styles.itemPrice}>{item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Total Footer */}
                    <div className={styles.orderFooter}>
                      <span className={styles.totalLabel}>Total Order Value</span>
                      <span className={styles.totalAmount}>{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyCard}>
                <ShoppingBag size={36} color="#8C887E" />
                <h3 className={styles.emptyTitle}>No Order History Found</h3>
                <p className={styles.emptySub}>
                  Explore our product catalog for heavy forklift attachments, safety equipment, and structural hardware.
                </p>
                <Link href="/products" className={styles.browseBtn}>
                  Browse Catalog
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Account & Delivery Information</h2>
            </div>

            <div className={styles.settingsCard}>
              <form onSubmit={handleSaveSettings} className={styles.formGrid}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <div className={styles.inputWrapper}>
                      <UserIcon size={18} className={styles.inputIcon} />
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                        className={styles.input}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <div className={styles.inputWrapper}>
                      <Mail size={18} className={styles.inputIcon} />
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                        className={styles.input}
                        placeholder="client@company.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Company / Organization</label>
                    <div className={styles.inputWrapper}>
                      <Building size={18} className={styles.inputIcon} />
                      <input
                        type="text"
                        value={userData.company}
                        onChange={(e) => setUserData(prev => ({ ...prev, company: e.target.value }))}
                        className={styles.input}
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Primary Dispatch Address</label>
                    <div className={styles.inputWrapper}>
                      <MapPin size={18} className={styles.inputIcon} />
                      <input
                        type="text"
                        value={userData.address}
                        onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                        className={styles.input}
                        placeholder="Industrial Area, Sector 4, Dammam"
                      />
                    </div>
                  </div>
                </div>

                {saveSuccess && (
                  <div style={{ color: '#059669', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Profile settings saved successfully!
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className={styles.saveBtn}
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save Profile Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { Profile };