"use client";

import React, { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  RefreshCw,
  Trash2
} from "lucide-react";
import styles from "./page.module.css";
import apiClient from "@/lib/apiClient";

// Define TypeScript interfaces
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  orders: number;
  totalSpent: number;
  status: string;
  // Add other fields as needed
  address?: string;
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<{ id: string; date: string; amount: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let userData: any = null;
      try {
        const response = await apiClient.request(`/admin/users/${id}`);
        userData = response.user || response;
      } catch (e) {
        console.warn('User lookup by ID failed, falling back to orders:', e);
      }

      // Fetch customer's orders from admin orders endpoint
      let customerOrdersData: any[] = [];
      try {
        const ordersResponse = await apiClient.request(`/admin/orders?limit=1000`);
        const allAdminOrders = ordersResponse.orders || [];
        customerOrdersData = allAdminOrders.filter((order: any) => {
          const uId = typeof order.user === 'object' ? order.user?._id?.toString() : order.user?.toString();
          const uEmail = order.user?.email || order.shippingAddress?.email;
          return uId === id || (userData && userData.email && uEmail?.toLowerCase() === userData.email.toLowerCase());
        });
      } catch (e) {
        console.warn('Admin orders fetch error:', e);
      }

      const sampleOrder = customerOrdersData[0];
      const customerName = userData?.name || sampleOrder?.user?.name || sampleOrder?.shippingAddress?.name || 'Customer';
      const customerEmail = userData?.email || sampleOrder?.user?.email || sampleOrder?.shippingAddress?.email || 'No email';
      const customerPhone = userData?.phone || sampleOrder?.shippingAddress?.phone || sampleOrder?.user?.phone || 'No phone';
      const customerAddress = userData?.address || (sampleOrder?.shippingAddress ? `${sampleOrder.shippingAddress.address}, ${sampleOrder.shippingAddress.city}` : 'No address');

      const orderCount = customerOrdersData.length;
      const totalSpent = customerOrdersData.reduce((sum: number, order: { totalPrice?: number }) => sum + (order.totalPrice || 0), 0);

      // Format customer data for display
      const formattedCustomer: Customer = {
        id: userData?._id || userData?.id || id,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        joinDate: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : (sampleOrder?.createdAt ? new Date(sampleOrder.createdAt).toLocaleDateString() : 'Recent'),
        orders: orderCount,
        totalSpent: totalSpent,
        status: userData?.isActive !== false ? 'Active' : 'Inactive',
        address: customerAddress
      };

      // Format orders for display
      const formattedOrders = customerOrdersData.slice(0, 5).map((order: { _id: string; createdAt: string; totalPrice?: number; isDelivered: boolean }) => ({
        id: `#${order._id.slice(-6)}`,
        date: new Date(order.createdAt).toLocaleDateString(),
        amount: `₹${order.totalPrice?.toFixed(2) || '0.00'}`,
        status: order.isDelivered ? 'Delivered' : 'Processing'
      }));

      setCustomer(formattedCustomer);
      setCustomerOrders(formattedOrders);
    } catch (err: unknown) {
      console.error('Failed to fetch customer:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to load customer data');
      } else {
        setError('Failed to load customer data');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id, fetchCustomer]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchCustomer();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customer) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete customer "${customer.name}"?\n\nThis action cannot be undone and will permanently remove the customer and all their data.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await apiClient.request(`/admin/users/${id}`, {
        method: 'DELETE'
      });

      alert('Customer deleted successfully');
      router.push('/admin/customers');
    } catch (err: unknown) {
      console.error('Failed to delete customer:', err);
      alert('Failed to delete customer. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.customerDetailsPage}>
        <div className={styles.header}>
          <div className={styles.backLink}>
            <div className={styles.skeletonText} style={{ width: '120px' }}></div>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.skeletonButton}></div>
            <div className={styles.skeletonButton}></div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          {/* Customer Info Card Skeleton */}
          <Card className={styles.infoCard}>
            <CardContent className={styles.cardContent}>
              <div className={styles.customerHeader}>
                <div className={styles.skeletonAvatar}></div>
                <div className={styles.customerInfo}>
                  <div className={styles.skeletonTitle}></div>
                  <div className={styles.skeletonBadge}></div>
                </div>
              </div>

              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <div className={styles.skeletonIcon}></div>
                  <div className={styles.skeletonText} style={{ width: '200px' }}></div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.skeletonIcon}></div>
                  <div className={styles.skeletonText} style={{ width: '150px' }}></div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.skeletonIcon}></div>
                  <div className={styles.skeletonText} style={{ width: '180px' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card Skeleton */}
          <Card className={styles.statsCard}>
            <CardContent className={styles.cardContent}>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.skeletonText} style={{ width: '80px', height: '14px' }}></div>
                  <div className={styles.skeletonText} style={{ width: '40px', height: '24px' }}></div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.skeletonText} style={{ width: '80px', height: '14px' }}></div>
                  <div className={styles.skeletonText} style={{ width: '60px', height: '24px' }}></div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.skeletonText} style={{ width: '80px', height: '14px' }}></div>
                  <div className={styles.skeletonText} style={{ width: '50px', height: '20px' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Card Skeleton */}
          <Card className={styles.ordersCard}>
            <CardHeader>
              <div className={styles.skeletonTitle}></div>
            </CardHeader>
            <CardContent>
              <div className={styles.tableContainer}>
                <table className={styles.ordersTable}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index}>
                        <td><div className={styles.skeletonText} style={{ width: '80px' }}></div></td>
                        <td><div className={styles.skeletonText} style={{ width: '100px' }}></div></td>
                        <td><div className={styles.skeletonText} style={{ width: '70px' }}></div></td>
                        <td><div className={styles.skeletonBadge}></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.customerDetailsPage}>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <Button onClick={() => router.refresh()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className={styles.customerDetailsPage}>
        <div className={styles.errorContainer}>
          <p>Customer not found</p>
          <Link href="/admin/customers" className={styles.backLink}>
            <ArrowLeft className={styles.backIcon} />
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.customerDetailsPage}>
      <div className={styles.header}>
        <Link href="/admin/customers" className={styles.backLink}>
          <ArrowLeft className={styles.backIcon} />
          Back to Customers
        </Link>
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className={styles.refreshButton}
          >
            <RefreshCw className={`${styles.refreshIcon} ${refreshing ? styles.spinning : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteCustomer}
            disabled={loading || deleting}
            className={styles.deleteButton}
          >
            <Trash2 className={styles.deleteIcon} />
            {deleting ? 'Deleting...' : 'Delete Customer'}
          </Button>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Customer Info Card */}
        <Card className={styles.infoCard}>
          <CardContent className={styles.cardContent}>
            <div className={styles.customerHeader}>
              <div className={styles.customerAvatar}>
                {customer.name.charAt(0)}
              </div>
              <div className={styles.customerInfo}>
                <h1 className={styles.customerName}>{customer.name}</h1>
                <span className={`${styles.statusBadge} ${styles[customer.status.toLowerCase()]}`}>
                  {customer.status}
                </span>
              </div>
            </div>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <span>{customer.email}</span>
              </div>
              
              {customer.phone && (
                <div className={styles.contactItem}>
                  <Phone className={styles.contactIcon} />
                  <span>{customer.phone}</span>
                </div>
              )}
              
              <div className={styles.contactItem}>
                <Calendar className={styles.contactIcon} />
                <span>Joined: {customer.joinDate}</span>
              </div>
              
              {customer.address && (
                <div className={styles.contactItem}>
                  <MapPin className={styles.contactIcon} />
                  <span>{customer.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className={styles.statsCard}>
          <CardContent className={styles.cardContent}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Orders</span>
                <span className={styles.statValue}>{customer.orders}</span>
              </div>
              
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Spent</span>
                <span className={styles.statValue}>₹{customer.totalSpent.toFixed(2)}</span>
              </div>
              
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Status</span>
                <span className={styles.statValue}>
                  <span className={`${styles.statusBadge} ${styles[customer.status.toLowerCase()]}`}>
                    {customer.status}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className={styles.ordersCard}>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.tableContainer}>
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customerOrders.length > 0 ? (
                    customerOrders.map((order, index) => (
                      <tr key={index}>
                        <td>{order.id}</td>
                        <td>{order.date}</td>
                        <td>{order.amount}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center' }}>
                        No orders found for this customer
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

