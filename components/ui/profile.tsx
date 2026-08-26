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

export function ProfileSkeleton() {
  return (
    <div className={styles.profileContainer} style={{ minHeight: "80vh" }}>
      {/* Header Card Skeleton */}
      <div className={`${styles.headerCard} ${styles.shimmer}`}>
        <div className={styles.userInfoGroup}>
          <div className={`${styles.avatarBox} ${styles.shimmerAvatar}`} style={{ background: '#EBE7DF' }} />
          <div className={styles.userMeta}>
            <div className={styles.shimmerLine} style={{ width: "180px", height: "24px", marginBottom: "8px" }} />
            <div className={styles.shimmerLine} style={{ width: "120px", height: "16px" }} />
          </div>
        </div>
        <div className={`${styles.signOutBtn} ${styles.shimmerButton}`} style={{ width: "100px", height: "40px", border: "1px solid #EBE7DF" }} />
      </div>

      {/* Tabs Skeleton */}
      <div className={styles.tabsBar}>
        <div className={styles.shimmerLine} style={{ width: "150px", height: "30px", marginRight: "16px" }} />
        <div className={styles.shimmerLine} style={{ width: "150px", height: "30px" }} />
      </div>

      {/* Content Skeleton */}
      <div className={styles.tabContentSection}>
        <div className={styles.shimmerLine} style={{ width: "240px", height: "24px", marginBottom: "24px" }} />
        <div className={styles.ordersList}>
          {[1, 2].map((i) => (
            <div key={i} className={styles.orderCard} style={{ opacity: 0.6 }}>
              <div className={styles.orderHeader} style={{ borderBottom: "1px solid #eee", paddingBottom: "16px", marginBottom: "20px" }}>
                <div className={styles.shimmerLine} style={{ width: "200px", height: "20px" }} />
                <div className={styles.shimmerLine} style={{ width: "80px", height: "24px", borderRadius: "12px" }} />
              </div>
              <div className={styles.timelineBox} style={{ marginBottom: "20px" }}>
                <div className={styles.shimmerLine} style={{ width: "100%", height: "40px" }} />
              </div>
              <div className={styles.itemsGrid}>
                <div className={styles.itemRow} style={{ background: "#f9f9f9" }}>
                  <div className={`${styles.itemThumb} ${styles.shimmerAvatar}`} style={{ width: "56px", height: "56px", borderRadius: "6px" }} />
                  <div style={{ flex: 1, marginLeft: "16px" }}>
                    <div className={styles.shimmerLine} style={{ width: "150px", height: "18px", marginBottom: "8px" }} />
                    <div className={styles.shimmerLine} style={{ width: "80px", height: "14px" }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
          name: activeUser.name || session?.user?.name || "Saudi Fab Client",
          email: activeUser.email || session?.user?.email || "",
          company: activeUser.company || "saudifabstore Industrial Partner",
          address: activeUser.address 
            ? `${activeUser.address.street || ""}, ${activeUser.address.city || ""}, ${activeUser.address.state || ""} ${activeUser.address.zip || ""}`.replace(/^, |, $/, "")
            : ""
        });

        // Fetch user orders safely
        try {
          const queryParam = session?.user?.id ? `?userId=${session.user.id}` : '';
          const ordersResponse: GetOrdersResponse = await apiClient.request(`/orders${queryParam}`);
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
                  name: item.product?.name || "Structural Steel Component",
                  price: `SAR ${(item.price || 0).toFixed(2)}`,
                  image: item.product?.images?.[0] || "/images/home/category_grid/warehouse.jpeg"
                })),
                total: `SAR ${(order.totalPrice || 0).toFixed(2)}`
              };
            });

            setOrders(formattedOrders);
          }
        } catch (ordersErr) {
          console.warn("Could not fetch orders:", ordersErr);
          setOrders([]);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile information.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
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
    return <ProfileSkeleton />;
  }

  return (
    <div className={styles.profileContainer}>
      {/* Minimal Header with Avatar */}
      <div className={styles.headerCard}>
        <div className={styles.userInfoGroup}>
          <div className={styles.avatarBox}>
            {initialLetter}
          </div>
          <div className={styles.userMeta}>
            <h1 className={styles.userName}>{userData.name || "Saudi Fab Client"}</h1>
            <p className={styles.userEmail}>{userData.email || session?.user?.email || "client@saudifabstore.com"}</p>
          </div>
        </div>

        <button 
          type="button"
          className={styles.signOutBtn}
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut size={15} />
          Sign Out
        </button>
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
                        {order.status === 'delivered' ? (
                          <CheckCircle2 size={13} />
                        ) : order.status === 'shipped' ? (
                          <Truck size={13} />
                        ) : (
                          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />
                        )}
                        {order.status}
                      </div>
                    </div>

                    {/* Order Fulfillment Timeline */}
                    <div className={styles.timelineBox}>
                      <div className={styles.timelineRow}>
                        <div className={styles.timelineTrack}>
                          <div 
                            className={styles.timelineProgress} 
                            style={{
                              width: order.status === 'delivered' ? '100%' : (order.status === 'shipped' ? '50%' : '15%')
                            }} 
                          />
                        </div>

                        <div className={styles.timelineStep}>
                          <div className={`${styles.stepIconBox} ${styles.stepIconPaid}`}>
                            <CreditCard size={15} />
                          </div>
                          <div className={styles.stepMeta}>
                            <span className={styles.stepTitle}>Payment Confirmed</span>
                            <span className={styles.stepTime}>{order.date}</span>
                          </div>
                        </div>

                        <div className={styles.timelineStep}>
                          <div className={`${styles.stepIconBox} ${order.shippedAt || order.status === 'shipped' || order.status === 'delivered' ? styles.stepIconShipped : ''}`}>
                            <Truck size={15} />
                          </div>
                          <div className={styles.stepMeta}>
                            <span className={styles.stepTitle}>Dispatched</span>
                            <span className={styles.stepTime}>
                              {order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : (order.status === 'shipped' || order.status === 'delivered' ? 'In Transit' : 'In Preparation')}
                            </span>
                          </div>
                        </div>

                        <div className={styles.timelineStep}>
                          <div className={`${styles.stepIconBox} ${order.deliveredAt || order.status === 'delivered' ? styles.stepIconDelivered : ''}`}>
                            <CheckCircle2 size={15} />
                          </div>
                          <div className={styles.stepMeta}>
                            <span className={styles.stepTitle}>Delivered</span>
                            <span className={styles.stepTime}>
                              {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : (order.status === 'delivered' ? 'Completed' : 'Pending Delivery')}
                            </span>
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
