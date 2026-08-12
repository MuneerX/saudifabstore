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
    
    const customerName = order.user?.name || order.shippingAddress?.name || 'Customer';
    const customerEmail = order.user?.email || order.shippingAddress?.email || 'No email';
    const customerPhone = order.shippingAddress?.phone || (order.user as any)?.phone || 'Not provided';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${order._id} - Brooq Al Khalij</title>
          <style>
            @media print {
              body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; color: #111; }
              .no-print { display: none !important; }
              .invoice-card { border: none !important; box-shadow: none !important; }
            }
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 30px; background-color: #f8fafc; color: #1e293b; }
            .invoice-card { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
            .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #EA532B; padding-bottom: 24px; margin-bottom: 30px; }
            .brand-section { display: flex; flex-direction: column; gap: 4px; }
            .company-name { font-size: 24px; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: -0.02em; }
            .company-tagline { font-size: 12px; color: #EA532B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
            .company-details { font-size: 13px; color: #64748b; margin-top: 8px; line-height: 1.5; }
            .invoice-title-block { text-align: right; }
            .invoice-title { font-size: 32px; font-weight: 800; color: #EA532B; letter-spacing: -0.03em; margin: 0; }
            .invoice-number { font-size: 13px; color: #64748b; margin-top: 4px; font-family: monospace; }
            
            .order-info { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
            .info-section h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #EA532B; margin: 0 0 12px 0; }
            .info-item { font-size: 13.5px; color: #334155; margin-bottom: 4px; line-height: 1.4; }
            .info-item strong { color: #0f172a; }

            .items-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
            .items-table th { background-color: #f1f5f9; color: #475569; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; padding: 12px 16px; border-bottom: 2px solid #e2e8f0; text-align: left; }
            .items-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
            .items-table td.text-right, .items-table th.text-right { text-align: right; }
            
            .summary-container { display: flex; justify-content: flex-end; margin-top: 24px; }
            .summary-section { width: 320px; background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #475569; margin-bottom: 8px; }
            .total-row { display: flex; justify-content: space-between; border-top: 2px solid #EA532B; padding-top: 12px; margin-top: 8px; font-weight: 800; font-size: 18px; color: #0f172a; }
            
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: capitalize; }
            .status-completed { background-color: #dcfce7; color: #15803d; }
            .status-pending { background-color: #ffedd5; color: #c2410c; }
            
            .footer-info { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
            .no-print { margin-top: 24px; text-align: center; }
            .no-print button { margin: 0 8px; padding: 10px 24px; font-weight: 600; border-radius: 6px; cursor: pointer; border: none; font-size: 14px; }
            .btn-print { background-color: #EA532B; color: white; }
            .btn-close { background-color: #e2e8f0; color: #334155; }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="invoice-header">
              <div class="brand-section">
                <div class="company-name">Brooq Al Khalij</div>
                <div class="company-tagline">Contracting & Trading Co.</div>
                <div class="company-details">
                  King Fahd Road, Dammam 31952, Kingdom of Saudi Arabia<br/>
                  Phone: +966 13 800 0000 | Email: sales@brooqalkhalij.com<br/>
                  CR: 2050123456 | VAT Reg No: 300123456700003
                </div>
              </div>
              <div class="invoice-title-block">
                <h1 class="invoice-title">INVOICE</h1>
                <div class="invoice-number">ID: #${order._id}</div>
              </div>
            </div>

            <div class="order-info">
              <div class="info-section">
                <h3>Billed To (Customer):</h3>
                <div class="info-item"><strong>${customerName}</strong></div>
                <div class="info-item">Email: ${customerEmail}</div>
                <div class="info-item">Phone: ${customerPhone}</div>
                <div class="info-item">Address: ${order.shippingAddress?.address || 'No address provided'}</div>
                <div class="info-item">${order.shippingAddress?.city || ''} ${order.shippingAddress?.postalCode ? `- ${order.shippingAddress.postalCode}` : ''}, ${order.shippingAddress?.country || ''}</div>
              </div>

              <div class="info-section">
                <h3>Order Details:</h3>
                <div class="info-item"><strong>Order ID:</strong> ${order._id}</div>
                <div class="info-item"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</div>
                <div class="info-item"><strong>Payment Method:</strong> ${order.paymentMethod}</div>
                <div class="info-item"><strong>Fulfillment Status:</strong>
                  <span class="status-badge ${order.isDelivered ? 'status-completed' : 'status-pending'}">
                    ${order.isDelivered ? 'Delivered' : (order.shippingStatus || 'Pending')}
                  </span>
                </div>
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>Description / Product</th>
                  <th class="text-right">Qty</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                ${order.orderItems?.map((item) => `
                  <tr>
                    <td><strong>${item.product?.name || 'Product'}</strong></td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">$${(item.price || 0).toFixed(2)}</td>
                    <td class="text-right">$${((item.price || 0) * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('') || ''}
              </tbody>
            </table>

            <div class="summary-container">
              <div class="summary-section">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>$${(order.itemsPrice || 0).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>Freight / Shipping:</span>
                  <span>$${(order.shippingPrice || 0).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>VAT (10%):</span>
                  <span>$${(order.taxPrice || 0).toFixed(2)}</span>
                </div>
                <div class="total-row">
                  <span>Total Amount:</span>
                  <span>$${(order.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div class="footer-info">
              Thank you for choosing Brooq Al Khalij Contracting & Trading Co.<br/>
              Invoice generated electronically on ${new Date().toLocaleString()}
            </div>

            <div class="no-print">
              <button class="btn-print" onclick="window.print()">Print Invoice</button>
              <button class="btn-close" onclick="window.close()">Close Window</button>
            </div>
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
              <div className={styles.customerName}>{order.user?.name || order.shippingAddress?.name || 'Customer'}</div>
              <div className={styles.customerContact}>
                <div>{order.user?.email || order.shippingAddress?.email || 'No email'}</div>
                <div>Phone: {order.shippingAddress?.phone || (order.user as any)?.phone || 'Not provided'}</div>
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