"use client";

import React, { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  RefreshCw,
  Printer,
  CreditCard
} from "lucide-react";
import styles from "./page.module.css";
import apiClient from "@/lib/apiClient";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<{
    _id: string;
    createdAt: string;
    paymentMethod: string;
    isPaid: boolean;
    isDelivered: boolean;
    shippingStatus?: 'pending' | 'shipped' | 'delivered';
    paidAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
    user?: {
      name: string;
      email: string;
    };
    shippingAddress?: {
      address: string;
      city: string;
      postalCode: string;
      country: string;
    };
    orderItems?: {
      product?: {
        _id: string;
        name: string;
        images?: string[];
      };
      quantity: number;
      price: number;
    }[];
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

 const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getOrderById(resolvedParams.id);
      setOrder(response.order);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to load order details');
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    if (resolvedParams.id) {
      fetchOrder();
    }
  }, [resolvedParams.id, fetchOrder]);


  const handleUpdateStatus = async (newStatus: 'pending' | 'shipped' | 'delivered') => {
    if (!order) return;

    try {
      setUpdatingStatus(true);

      await apiClient.request('/admin/orders', {
        method: 'PUT',
        body: JSON.stringify({
          orderId: resolvedParams.id,
          shippingStatus: newStatus,
        })
      });

      // Update local state
      setOrder((prev) => prev ? {
        ...prev,
        shippingStatus: newStatus,
        isDelivered: newStatus === 'delivered',
        shippedAt: newStatus === 'shipped' ? new Date().toISOString() : prev.shippedAt,
        deliveredAt: newStatus === 'delivered' ? new Date().toISOString() : prev.deliveredAt,
      } : null);

    } catch (err: unknown) {
      const error = err as Error;
      console.error('Failed to update order status:', error);
      alert('Failed to update order status: ' + (error.message || 'Unknown error'));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const generateInvoiceHTML = () => {
    if (!order) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice - Order Not Found</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .error { color: red; text-align: center; margin-top: 50px; }
            </style>
          </head>
          <body>
            <div class="error">
              <h2>Order Not Found</h2>
              <p>Unable to generate invoice: Order data is not available.</p>
            </div>
          </body>
        </html>
      `;
    }
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - Order ${order._id}</title>
          <style>
            @media print {
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .no-print { display: none; }
            }
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .invoice-title { font-size: 28px; font-weight: bold; color: #333; margin-bottom: 10px; }
            .company-info { font-size: 14px; color: #666; }
            .order-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .info-section { flex: 1; }
            .info-section h3 { font-size: 16px; margin-bottom: 10px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .info-item { margin-bottom: 5px; font-size: 14px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .items-table th { background-color: #f5f5f5; font-weight: bold; }
            .items-table .total-row { font-weight: bold; background-color: #f9f9f9; }
            .summary-section { margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .status-completed { background-color: #d4edda; color: #155724; }
            .status-paid { background-color: #cce5ff; color: #004085; }
            .status-pending { background-color: #fff3cd; color: #856404; }
            .print-date { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .no-print { margin-top: 20px; text-align: center; }
            .no-print button { margin: 0 10px; padding: 10px 20px; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <h1 class="invoice-title">INVOICE</h1>
            <div class="company-info">
              <div>Your Company Name</div>
              <div>123 Business Street, City, State 12345</div>
              <div>Phone: (555) 123-4567 | Email: info@yourcompany.com</div>
            </div>
          </div>

          <div class="order-info">
            <div class="info-section">
              <h3>Bill To:</h3>
              <div class="info-item"><strong>${order.user?.name || 'Customer'}</strong></div>
              <div class="info-item">${order.user?.email || 'No email'}</div>
              <div class="info-item">${order.shippingAddress?.address || 'No address'}</div>
              <div class="info-item">${order.shippingAddress?.city || ''}, ${order.shippingAddress?.postalCode || ''}</div>
              <div class="info-item">${order.shippingAddress?.country || ''}</div>
            </div>

            <div class="info-section">
              <h3>Order Details:</h3>
              <div class="info-item"><strong>Order ID:</strong> ${order._id}</div>
              <div class="info-item"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</div>
              <div class="info-item"><strong>Payment Method:</strong> ${order.paymentMethod}</div>
              <div class="info-item"><strong>Status:</strong>
                <span class="status-badge ${order.isDelivered ? 'status-completed' : 'status-pending'}">
                  ${order.isDelivered ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems?.map((item) => `
                <tr>
                  <td>${item.product?.name || 'Product'}</td>
                  <td>${item.quantity}</td>
                  <td>₹${(item.price || 0).toFixed(2)}</td>
                  <td>₹${((item.price || 0) * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary-section">
            <div class="summary-row">
              <span>Items Price:</span>
              <span>₹${(order.itemsPrice || 0).toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Shipping:</span>
              <span>₹${(order.shippingPrice || 0).toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Tax:</span>
              <span>₹${(order.taxPrice || 0).toFixed(2)}</span>
            </div>
            <div class="summary-row" style="border-top: 2px solid #333; padding-top: 10px; font-weight: bold; font-size: 16px;">
              <span>Total:</span>
              <span>₹${(order.totalPrice || 0).toFixed(2)}</span>
            </div>
          </div>

          <div class="print-date">
            Invoice generated on ${new Date().toLocaleString()}
          </div>

          <div class="no-print">
            <button onclick="window.print()">Print Invoice</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrintInvoice = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow || !order) return;

    printWindow.document.write(generateInvoiceHTML());
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print();
    };
  };


  const getStatusIcon = () => {
    if (!order) return <Package className={styles.statusIcon} aria-hidden="true" />;

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

    switch (status) {
      case 'delivered':
        return <CheckCircle className={styles.statusIcon} aria-hidden="true" />;
      case 'shipped':
        return <Truck className={styles.statusIcon} aria-hidden="true" />;
      default:
        return <Package className={styles.statusIcon} aria-hidden="true" />;
    }
  };

  const getStatusText = () => {
    if (!order) return 'Loading...';

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

    switch (status) {
      case 'pending':
        return 'Pending Shipping';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  const getStatusClass = () => {
    if (!order) return '';

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

    switch (status) {
      case 'delivered':
        return styles.delivered;
      case 'shipped':
        return styles.shipped;
      default:
        return styles.pending;
    }
  };

  if (loading) {
    return (
      <div className={styles.orderDetailsPage}>
        <div className={styles.header}>
          <div className={styles.skeletonText} style={{ width: '150px' }}></div>
          <div className={styles.headerInfo}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonBadge}></div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          {/* Order Information Skeleton */}
          <Card className={styles.infoCard}>
            <CardHeader>
              <div className={styles.skeletonTitle} style={{ width: '180px' }}></div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.infoGrid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={styles.infoItem}>
                    <div className={styles.skeletonText} style={{ width: '100px', height: '14px' }}></div>
                    <div className={styles.skeletonText} style={{ width: '120px', height: '16px' }}></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Information Skeleton */}
          <Card className={styles.infoCard}>
            <CardHeader>
              <div className={styles.skeletonTitle} style={{ width: '180px' }}></div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.customerInfo}>
                <div className={styles.skeletonTitle} style={{ width: '150px' }}></div>
                <div className={styles.customerContact}>
                  <div className={styles.skeletonText} style={{ width: '200px' }}></div>
                  <div className={styles.skeletonText} style={{ width: '150px' }}></div>
                </div>
                <div className={styles.customerAddress}>
                  <div className={styles.skeletonText} style={{ width: '250px' }}></div>
                  <div className={styles.skeletonText} style={{ width: '180px' }}></div>
                  <div className={styles.skeletonText} style={{ width: '120px' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items Skeleton */}
          <Card className={`${styles.infoCard} ${styles.itemsCard}`}>
            <CardHeader>
              <div className={styles.skeletonTitle} style={{ width: '120px' }}></div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.itemsList}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={styles.item}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.itemDetails}>
                      <div className={styles.skeletonTitle} style={{ width: '200px' }}></div>
                      <div className={styles.skeletonText} style={{ width: '100px' }}></div>
                      <div className={styles.skeletonText} style={{ width: '80px' }}></div>
                    </div>
                    <div className={styles.skeletonText} style={{ width: '60px' }}></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Skeleton */}
          <Card className={styles.summaryCard}>
            <CardHeader>
              <div className={styles.skeletonTitle} style={{ width: '140px' }}></div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.summaryList}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={styles.summaryItem}>
                    <div className={styles.skeletonText} style={{ width: '100px' }}></div>
                    <div className={styles.skeletonText} style={{ width: '60px' }}></div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className={styles.cardFooter}>
              <div className={styles.skeletonButton}></div>
              <div className={styles.skeletonButton}></div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.orderDetailsPage}>
        <div className={styles.errorContainer}>
          <p>Failed to load order details</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.orderDetailsPage}>
        <div className={styles.errorContainer}>
          <p>Order not found</p>
          <Link href="/admin/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderDetailsPage}>
      <div className={styles.header}>
        <Link href="/admin/orders" className={styles.backLink}>
          <ArrowLeft className={styles.backIcon} aria-hidden="true" />
          Back to Orders
        </Link>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Order Details</h1>
          <div className={`${styles.statusBadge} ${getStatusClass()}`} aria-label={`Order status: ${getStatusText()}`}>
            {getStatusIcon()}
            {getStatusText()}
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Order Information */}
        <Card className={styles.infoCard}>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Order ID</span>
                <span className={styles.infoValue}>{order._id}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Order Date</span>
                <span className={styles.infoValue}>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Payment Method</span>
                <span className={styles.infoValue}>{order.paymentMethod}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Shipping Status</span>
                <span className={styles.infoValue}>
                  {(() => {
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

                    switch (status) {
                      case 'pending':
                        return 'Pending Shipping';
                      case 'shipped':
                        return 'Shipped';
                      case 'delivered':
                        return 'Delivered';
                      default:
                        return 'Unknown';
                    }
                  })()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Timeline */}
        <Card className={styles.timelineCard}>
          <CardHeader>
            <CardTitle>Order Timeline</CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.timeline}>
              {order.paidAt && (
                <div className={styles.timelineItem}>
                  <div className={styles.timelineIcon}>
                    <CreditCard className={styles.paidIcon} aria-hidden="true" />
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Payment Completed</div>
                    <div className={styles.timelineDate}>
                      {new Date(order.paidAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
              {order.shippedAt && (
                <div className={styles.timelineItem}>
                  <div className={styles.timelineIcon}>
                    <Truck className={styles.shippedIcon} aria-hidden="true" />
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Order Shipped</div>
                    <div className={styles.timelineDate}>
                      {new Date(order.shippedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
              {order.isDelivered && order.deliveredAt && (
                <div className={styles.timelineItem}>
                  <div className={styles.timelineIcon}>
                    <CheckCircle className={styles.deliveredIcon} aria-hidden="true" />
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Order Delivered</div>
                    <div className={styles.timelineDate}>
                      {new Date(order.deliveredAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className={styles.infoCard}>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.customerInfo}>
              <div className={styles.customerName}>{order.user?.name || 'Unknown Customer'}</div>
              <div className={styles.customerContact}>
                <div>{order.user?.email || 'No email'}</div>
                <div>Phone: Not provided</div>
              </div>
              <div className={styles.customerAddress}>
                <div>{order.shippingAddress?.address || 'No address provided'}</div>
                <div>
                  {order.shippingAddress?.city || ''}, {order.shippingAddress?.postalCode || ''}
                </div>
                <div>{order.shippingAddress?.country || ''}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className={`${styles.infoCard} ${styles.itemsCard}`}>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.itemsList}>
              {order.orderItems?.map((item, index) => (
                <div key={item.product?._id || index} className={styles.item}>
                  <Image
                    src={item.product?.images?.[0] || '/placeholder.png'}
                    alt={item.product?.name || 'Product'}
                    className={styles.itemImage}
                    width={60}
                    height={60}
                  />
                  <div className={styles.itemDetails}>
                    <div className={styles.itemName}>{item.product?.name || 'Unknown Product'}</div>
                    <div className={styles.itemAttributes}>
                      Quantity: {item.quantity}
                    </div>
                    <div className={styles.itemPrice}>
                      ₹{item.price?.toFixed(2) || '0.00'} × {item.quantity}
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    ₹{((item.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className={styles.summaryCard}>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.summaryList}>
              <div className={styles.summaryItem}>
                <span>Items Price</span>
                <span>₹{order.itemsPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Shipping</span>
                <span>₹{order.shippingPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Tax</span>
                <span>₹{order.taxPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className={`${styles.summaryItem} ${styles.total}`}>
                <span>Total</span>
                <span>₹{order.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className={styles.cardFooter}>
            <div className={styles.statusButtons}>
              {(() => {
                // Determine status with proper fallback for existing orders
                let currentStatus = 'pending'; // default
                if (order.shippingStatus) {
                  currentStatus = order.shippingStatus;
                } else {
                  // Fallback for orders created before shippingStatus field
                  if (order.isPaid) {
                    currentStatus = order.isDelivered ? 'delivered' : 'shipped';
                  } else {
                    currentStatus = 'pending';
                  }
                }

                return (
                  <>
                    {currentStatus === 'pending' && (
                      <Button
                        variant="outline"
                        className={styles.statusButton}
                        onClick={() => handleUpdateStatus('shipped')}
                        disabled={updatingStatus}
                      >
                        <Truck className={styles.actionIcon} aria-hidden="true" />
                        {updatingStatus ? 'Updating...' : 'Mark as Shipped'}
                      </Button>
                    )}

                    {currentStatus === 'shipped' && (
                      <Button
                        variant="outline"
                        className={styles.statusButton}
                        onClick={() => handleUpdateStatus('delivered')}
                        disabled={updatingStatus}
                      >
                        <CheckCircle className={styles.actionIcon} aria-hidden="true" />
                        {updatingStatus ? 'Updating...' : 'Mark as Delivered'}
                      </Button>
                    )}

                    {currentStatus === 'delivered' && (
                      <div className={styles.deliveredMessage}>
                        <CheckCircle className={styles.deliveredIcon} aria-hidden="true" />
                        Order has been delivered
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <Button
              variant="default"
              className={styles.printInvoiceButton}
              onClick={handlePrintInvoice}
            >
              <Printer className={styles.actionIcon} aria-hidden="true" />
              Print Invoice
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}