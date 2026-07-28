"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import styles from "./profile.module.css"
import apiClient from "@/lib/apiClient"
import { Truck, CheckCircle, CreditCard } from "lucide-react"

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
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("orders")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // User profile data
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    address: ""
  })

  // Orders data
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
  >([])

  // Fetch user profile and orders data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch user profile
        const profileResponse = await apiClient.getProfile()
        const user = profileResponse.user

        setUserData({
          name: user.name || "",
          email: user.email || "",
          address: user.address ? `${user.address.street || ""}, ${user.address.city || ""}, ${user.address.state || ""} ${user.address.zip || ""}, ${user.address.country || ""}`.replace(/^, |, $/, "") : ""
        })

        // Fetch user orders
        const ordersResponse: GetOrdersResponse = await apiClient.request(`/orders?userId=${session!.user.id}`)
        const formattedOrders = ordersResponse.orders.map((order: Order) => {
          // Determine status with proper fallback for existing orders
          let status = 'pending'; // default
          if (order.shippingStatus) {
            status = order.shippingStatus;
          } else {
            // Fallback for orders created before shippingStatus field
            if (order.isPaid) {
              status = order.isDelivered ? 'delivered' : 'shipped';
            } else {
              status = 'pending';
            }
          }

          return {
            id: `#${order._id.slice(-6)}`, // Use last 6 characters of ObjectId
            date: new Date(order.createdAt).toLocaleDateString(),
            status: status,
            shippedAt: order.shippedAt ? new Date(order.shippedAt).toLocaleString() : undefined,
            deliveredAt: order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : undefined,
            items: order.orderItems.map((item: OrderItem) => ({
              name: item.product?.name || "Product",
              price: `$${item.price?.toFixed(2) || "0.00"}`,
              image: item.product?.images?.[0] || ""
            })),
            total: `$${order.totalPrice?.toFixed(2) || "0.00"}`
          };
        })

        setOrders(formattedOrders)
      } catch (err) {
        console.error("Failed to fetch profile data:", err)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchProfileData()
    }
  }, [session])

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      setError(null)

      await apiClient.updateProfile({
        name: userData.name,
        email: userData.email
      })

      alert("Settings saved successfully!")
    } catch (err) {
      console.error("Failed to save settings:", err)
      setError("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
        </div>
        <h1 className={styles.title}>My Profile</h1>
      </div>

      <div className={styles.tabsContainer}>
        <div
          className={`${styles.tab} ${activeTab === "orders" ? styles.active : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </div>
        <div
          className={`${styles.tab} ${activeTab === "settings" ? styles.active : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </div>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "orders" && (
          <div>
            <h2 className={styles.sectionTitle}>Order History</h2>
            {orders.length > 0 ? (
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div className={styles.orderId}>{order.id}</div>
                      <div className={`${styles.orderStatus} ${styles[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                    <div className={styles.orderTimeline}>
                      <div className={styles.timeline}>
                        {/* Payment Event - Always show for completed orders */}
                        <div className={styles.timelineItem}>
                          <div className={styles.timelineIcon}>
                            <CreditCard className={styles.paidIcon} aria-hidden="true" />
                          </div>
                          <div className={styles.timelineContent}>
                            <div className={styles.timelineTitle}>Payment Completed</div>
                            <div className={styles.timelineDate}>{order.date}</div>
                          </div>
                        </div>

                        {/* Shipped Event */}
                        {order.shippedAt && (
                          <div className={styles.timelineItem}>
                            <div className={styles.timelineIcon}>
                              <Truck className={styles.shippedIcon} aria-hidden="true" />
                            </div>
                            <div className={styles.timelineContent}>
                              <div className={styles.timelineTitle}>Order Shipped</div>
                              <div className={styles.timelineDate}>{order.shippedAt}</div>
                            </div>
                          </div>
                        )}

                        {/* Delivered Event */}
                        {order.deliveredAt && (
                          <div className={styles.timelineItem}>
                            <div className={styles.timelineIcon}>
                              <CheckCircle className={styles.deliveredIcon} aria-hidden="true" />
                            </div>
                            <div className={styles.timelineContent}>
                              <div className={styles.timelineTitle}>Order Delivered</div>
                              <div className={styles.timelineDate}>{order.deliveredAt}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.orderItems}>
                      {order.items.map((item, index) => (
                        <div key={index} className={styles.orderItem}>
                          <div className={styles.itemImage}>
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }}
                              />
                            )}
                          </div>
                          <div className={styles.itemDetails}>
                            <div className={styles.itemName}>{item.name}</div>
                            <div className={styles.itemPrice}>{item.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.orderTotal}>
                      <strong>Total: {order.total}</strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>You haven&apos;t placed any orders yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className={styles.sectionTitle}>Account Settings</h2>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            <div className={styles.settingsForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={styles.input}
                  placeholder="Enter your full name"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={styles.input}
                  placeholder="Enter your email"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Address</label>
                <input
                  type="text"
                  value={userData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={styles.input}
                  placeholder="Enter your address"
                />
              </div>
              <button
                className={`${styles.button} ${saving ? styles.saving : ""}`}
                onClick={handleSaveSettings}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { Profile }