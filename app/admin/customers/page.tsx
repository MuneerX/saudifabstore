"use client";

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
import { useAdminCustomers } from "@/lib/hooks/useAdminData";
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

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const isMobile = useIsMobile();

  // Fetch real customers data
  const { customers, loading, error, total, refetch } = useAdminCustomers();

  // Apply client-side filtering
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm));

    const matchesStatus = statusFilter === "All" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Skeleton component for table rows
  const CustomerTableSkeleton = () => (
    <tr>
      <td>
        <div className={styles.customerInfo}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonText}></div>
        </div>
      </td>
      <td><div className={styles.skeletonText}></div></td>
      <td><div className={styles.skeletonText}></div></td>
      <td><div className={styles.skeletonText}></div></td>
      <td><div className={styles.skeletonText}></div></td>
      <td><div className={styles.skeletonBadge}></div></td>
      <td><div className={styles.skeletonButton}></div></td>
    </tr>
  );

  if (loading) {
    return (
      <div className={styles.customersPage}>
        <div className={styles.header}>
          {!isMobile && <h1 className={styles.title}>Customers</h1>}
          <div className={styles.headerActions}>
            <div className={styles.skeletonButton}></div>
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

        {/* Customers Table Skeleton */}
        <Card className={styles.customersCard}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>Customer List</CardTitle>
            <div className={styles.skeletonCount}></div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.tableContainer}>
              <table className={styles.customersTable}>
                <thead>
                  <tr>
                    <th scope="col">Customer</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Join Date</th>
                    <th scope="col">Orders</th>
                    <th scope="col">Total Spent</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <CustomerTableSkeleton key={`skeleton-${index}`} />
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
      <div className={styles.customersPage}>
        <div className={styles.errorContainer}>
          <p>Failed to load customers</p>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.customersPage}>
      <div className={styles.header}>
        {!isMobile && <h1 className={styles.title}>Customers</h1>}
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
            <label htmlFor="search-customers" className="sr-only">Search customers</label>
            <Search className={styles.searchIcon} aria-hidden="true" />
            <input
              type="text"
              id="search-customers"
              placeholder="Search customers..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search customers"
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label className="sr-only">Filter by status</label>
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "All", label: "All Status" },
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" }
              ]}
              placeholder="All Status"
              className={styles.filterSelect}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className={styles.customersCard}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Customer List</CardTitle>
          <span className={styles.customerCount}>
            {filteredCustomers.length} of {total} customers
          </span>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.tableContainer}>
            <table className={styles.customersTable}>
              <thead>
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">Contact</th>
                  <th scope="col">Traffic Source</th>
                  <th scope="col">Join Date</th>
                  <th scope="col">Orders</th>
                  <th scope="col">Total Spent</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className={styles.customerInfo}>
                        <div className={styles.customerName}>{customer.name}</div>
                        <div className={styles.customerEmail}>
                          {customer.email && customer.email !== 'No email' ? customer.email : (customer.phone && customer.phone !== 'No phone' ? customer.phone : 'No contact email')}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactInfo}>
                        <div>{customer.phone && customer.phone !== 'No phone' ? customer.phone : (customer.email && customer.email !== 'No email' ? customer.email : 'N/A')}</div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.sourceTag}>
                        {customer.referralSource || "Direct"}
                      </span>
                    </td>
                    <td>{customer.joinDate}</td>
                    <td>{customer.orders}</td>
                    <td>SAR {customer.totalSpent.toFixed(2)}</td>
                    <td>
                      <span className={`${styles.status} ${styles[customer.status.toLowerCase()]}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/customers/${customer.id}`}>
                        <Button variant="ghost" size="sm" aria-label={`View customer ${customer.name}`}>
                          <Eye className={styles.eyeIcon} aria-hidden="true" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredCustomers.length === 0 && (
              <div className={styles.noCustomers}>
                <p>No customers found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}