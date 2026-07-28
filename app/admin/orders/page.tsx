"use client";

// hello world

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Eye,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import styles from "./page.module.css";
import { useAdminOrders } from "@/lib/hooks/useAdminData";
import { useIsMobile } from "@/hooks/use-mobile";

// Custom Dropdown Component
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`${styles.customSelect} ${className}`}>
      <div
        className={`${styles.selectTrigger} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? styles.selectedText : styles.placeholderText}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`${styles.selectArrow} ${isOpen ? styles.rotated : ''}`} />
      </div>

      {isOpen && (
        <>
          <div className={styles.selectOverlay} onClick={() => setIsOpen(false)} />
          <div className={styles.selectOptions}>
            {options.map((option) => (
              <div
                key={option.value}
                className={`${styles.selectOption} ${value === option.value ? styles.selected : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function OrdersPage() {
  // Define the order type
  interface Order {
    id: string;
    customer: string;
    email: string;
    date: string;
    amount: number;
    status: string;
    items: number;
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const isMobile = useIsMobile();

  // Fetch real orders data
  const { orders, loading, error, total, refetch } = useAdminOrders() as {
    orders: Order[];
    loading: boolean;
    error: string | null;
    total: number;
    refetch: () => void;
  };

  // Apply client-side filtering
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Skeleton component for table rows
  const OrderTableSkeleton = () => (
    <tr>
      <td><div className={styles.skeletonText}></div></td>
      <td>
        <div className={styles.customerInfo}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonText}></div>
        </div>
      </td>
      <td><div className={styles.skeletonText}></div></td>
      <td><div className={styles.skeletonText}></div></td>
      <td><div className={styles.skeletonBadge}></div></td>
      <td><div className={styles.skeletonText}></div></td>
      <td><div className={styles.skeletonButton}></div></td>
    </tr>
  );

  if (loading) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.header}>
          {!isMobile && <h1 className={styles.title}>Orders</h1>}
          <div className={styles.headerActions}>
            <div className={styles.skeletonButton}></div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <Card className={styles.filtersCard}>
          <CardContent className={styles.filtersContent}>
            <div className={styles.searchContainer}>
              <div className={styles.skeletonSearch}></div>
            </div>
            <div className={styles.filterGroup}>
              <div className={styles.skeletonSelect}></div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table Skeleton */}
        <Card className={styles.ordersCard}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>Order List</CardTitle>
            <div className={styles.skeletonCount}></div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.tableContainer}>
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Date</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Items</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <OrderTableSkeleton key={`skeleton-${index}`} />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.errorContainer}>
          <p>Failed to load orders</p>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ordersPage}>
      <div className={styles.header}>
        {!isMobile && <h1 className={styles.title}>Orders</h1>}
        <div className={styles.headerActions}>
          <Button
            variant="default"
            size="sm"
            onClick={() => refetch()}
            className={styles.refreshButton}
          >
            <RefreshCw className={styles.buttonIcon} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className={styles.filtersCard}>
        <CardContent className={styles.filtersContent}>
          <div className={styles.searchContainer}>
            <label htmlFor="search-orders" className="sr-only">Search orders</label>
            <Search className={styles.searchIcon} aria-hidden="true" />
            <input
              type="text"
              id="search-orders"
              placeholder="Search orders..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search orders"
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label className="sr-only">Filter by status</label>
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "All", label: "All Status" },
                { value: "pending", label: "Pending Shipping" },
                { value: "shipped", label: "Shipped" },
                { value: "delivered", label: "Delivered" }
              ]}
              placeholder="All Status"
              className={styles.filterSelect}
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className={styles.ordersCard}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Order List</CardTitle>
          <span className={styles.orderCount}>
            {filteredOrders.length} of {total} orders
          </span>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.tableContainer}>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th scope="col">Order ID</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Date</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Items</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link href={`/admin/orders/${order.id}`} className={styles.orderIdLink}>
                        {order.id}
                      </Link>
                    </td>
                    <td>
                      <div className={styles.customerInfo}>
                        <div className={styles.customerName}>{order.customer}</div>
                        <div className={styles.customerEmail}>{order.email}</div>
                      </div>
                    </td>
                    <td>{order.date}</td>
                    <td>₹{order.amount.toFixed(2)}</td>
                    <td>
                      <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td>{order.items}</td>
                    <td>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="sm" aria-label={`View order ${order.id}`}>
                          <Eye className={styles.eyeIcon} aria-hidden="true" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className={styles.noOrders}>
                <p>No orders found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}