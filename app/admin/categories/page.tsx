"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle, CheckCircle2, FolderTree, Loader2 } from "lucide-react";
import styles from "./page.module.css";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCat, setDeletingCat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add category");
      }

      setSuccess(`Category "${newCatName.trim()}" added successfully!`);
      setNewCatName("");
      fetchCategories();
    } catch (err: any) {
      setError(err.message || "Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    if (!confirm(`Are you sure you want to delete the category "${catName}"?`)) return;

    setError(null);
    setSuccess(null);
    setDeletingCat(catName);

    try {
      const res = await fetch(`/api/admin/categories?name=${encodeURIComponent(catName)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      setSuccess(data.message || `Category "${catName}" removed.`);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || "Failed to delete category");
    } finally {
      setDeletingCat(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>
            <FolderTree size={24} color="#2563eb" />
            Category Management
            <span className={styles.badgeCount}>{categories.length} Categories</span>
          </h1>
          <p className={styles.pageSub}>
            Safely add, inspect, or manage product categories for the Saudi Fab Store catalog.
          </p>
        </div>
      </div>

      {error && (
        <div className={styles.alertError}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={styles.alertSuccess}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Add Category Card */}
      <div className={styles.addCategoryCard}>
        <h2 className={styles.cardTitle}>Add New Product Category</h2>
        <form onSubmit={handleAddCategory} className={styles.addForm}>
          <input
            type="text"
            placeholder="e.g. Structural Steel H-Beams"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className={styles.inputField}
            required
          />
          <button type="submit" disabled={isSubmitting || !newCatName.trim()} className={styles.submitBtn}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Category
              </>
            )}
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading categories...</div>
        ) : (
          <table className={styles.categoriesTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr key={cat}>
                  <td style={{ color: "#94a3b8", width: "60px" }}>{idx + 1}</td>
                  <td>
                    <span className={styles.categoryTag}>{cat}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      disabled={deletingCat === cat}
                      className={styles.deleteBtn}
                    >
                      {deletingCat === cat ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
