"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import styles from "./page.module.css";
import { useAdminProducts } from "@/lib/hooks/useAdminData";
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

// Define the type for product items
interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: string;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const isMobile = useIsMobile();

  // Fetch real products data
  const { products, loading, error, total, refetch, deleteProduct } = useAdminProducts() as {
    products: ProductItem[];
    loading: boolean;
    error: string | null;
    total: number;
    refetch: () => void;
    deleteProduct: (productId: string) => Promise<{ success: boolean }>;
  };

  // Apply client-side filtering
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || product.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        // Refetch to ensure data is up to date
        refetch();
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  // Get unique categories for filter dropdown
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Skeleton component for table rows
  const ProductTableSkeleton = () => (
    <tr>
      <td>
        <div className={styles.productInfo}>
          <div className={styles.skeletonImage}></div>
          <div className={styles.skeletonTitle}></div>
        </div>
      </td>
      <td><div className={styles.skeletonText}></div></td>
      <td><div className={styles.skeletonText}></div></td>
      <td><div className={styles.skeletonText}></div></td>
      <td><div className={styles.skeletonBadge}></div></td>
      <td>
        <div className={styles.actions}>
          <div className={styles.skeletonButton}></div>
          <div className={styles.skeletonButton}></div>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className={styles.productsPage}>
        <div className={styles.header}>
          {!isMobile && <h1 className={styles.title}>Products</h1>}
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
            <div className={styles.filterGroup}>
              <div className={styles.skeletonSelect}></div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table Skeleton */}
        <Card className={styles.productsCard}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>Product List</CardTitle>
            <div className={styles.skeletonCount}></div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.tableContainer}>
              <table className={styles.productsTable}>
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <ProductTableSkeleton key={`skeleton-${index}`} />
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
      <div className={styles.productsPage}>
        <div className={styles.errorContainer}>
          <p>Failed to load products</p>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productsPage}>
      <div className={styles.header}>
        {!isMobile && <h1 className={styles.title}>Products</h1>}
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
          <Link href="/admin/products/add">
            <Button variant="default" className={styles.addProductButton}>
              <Plus className={styles.buttonIcon} />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className={styles.filtersCard}>
        <CardContent className={styles.filtersContent}>
          <div className={styles.searchContainer}>
            <label htmlFor="search-products" className="sr-only">Search products</label>
            <Search className={styles.searchIcon} aria-hidden="true" />
            <input
              type="text"
              id="search-products"
              placeholder="Search products..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
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
                { value: "Out of Stock", label: "Out of Stock" }
              ]}
              placeholder="All Status"
              className={styles.filterSelect}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className="sr-only">Filter by category</label>
            <CustomSelect
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categories.map(cat => ({ value: cat, label: cat }))}
              placeholder="All Categories"
              className={styles.filterSelect}
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className={styles.productsCard}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Product List</CardTitle>
          <span className={styles.productCount}>
            {filteredProducts.length} of {total} products
          </span>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.tableContainer}>
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.productInfo}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={60}
                          height={60}
                          className={styles.productImage}
                        />
                        <span className={styles.productName}>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
                    <td>€{product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`${styles.status} ${styles[product.status.toLowerCase().replace(' ', '')]}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Button variant="ghost" size="sm" aria-label={`Edit ${product.name}`}>
                            <Edit className={styles.editIcon} aria-hidden="true" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className={styles.deleteIcon} aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className={styles.noProducts}>
                <p>No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
