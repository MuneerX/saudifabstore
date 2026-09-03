"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Save, 
  Plus, 
  Factory, 
  ShieldCheck, 
  BadgeCheck, 
  Star,
  Image as ImageIcon
} from "lucide-react";
import styles from "./page.module.css";
import apiClient from "@/lib/apiClient";
import { INITIAL_PRODUCTS } from "@/lib/data/initialProducts";
import { PRODUCT_CATEGORIES } from "@/lib/data/categories";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'specs' | 'details'>('general');

  const isSavedRef = useRef(false);
  const sessionDraftsRef = useRef<string[]>([]);

  // Automatically purge unsaved draft Uploadcare uploads if page is closed/reloaded
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isSavedRef.current && sessionDraftsRef.current.length > 0) {
        sessionDraftsRef.current.forEach((url) => {
          if (url.includes("ucarecdn.com")) {
            fetch("/api/upload", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileUrl: url }),
              keepalive: true,
            }).catch(() => {});
          }
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (!isSavedRef.current && sessionDraftsRef.current.length > 0) {
        sessionDraftsRef.current.forEach((url) => {
          if (url.includes("ucarecdn.com")) {
            fetch("/api/upload", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileUrl: url }),
              keepalive: true,
            }).catch(() => {});
          }
        });
      }
    };
  }, []);

  const handleCancel = () => {
    if (!isSavedRef.current && sessionDraftsRef.current.length > 0) {
      sessionDraftsRef.current.forEach((url) => {
        if (url.includes("ucarecdn.com")) {
          fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileUrl: url }),
          }).catch(() => {});
        }
      });
      sessionDraftsRef.current = [];
    }
    router.push("/admin/products");
  };

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Steel Fabrication");
  const [categoryOptions, setCategoryOptions] = useState<string[]>(PRODUCT_CATEGORIES);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.categories)) {
          setCategoryOptions(data.categories);
        }
      })
      .catch(() => {});
  }, []);
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("20");
  const [hasMultipleOptions, setHasMultipleOptions] = useState(false);
  const [swatchSingleName, setSwatchSingleName] = useState("Single Standard");
  const [swatchBulkName, setSwatchBulkName] = useState("5-Pack Contractors");
  const [swatchBulkPrice, setSwatchBulkPrice] = useState("");
  const [enableSubscription, setEnableSubscription] = useState(true);
  const [subscriptionDiscountPercent, setSubscriptionDiscountPercent] = useState("10");
  const [promoBadge, setPromoBadge] = useState("FACTORY DIRECT");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [specImage, setSpecImage] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Specifications Editable State
  const [division, setDivision] = useState("Industrial Engineering & Manufacturing");
  const [primaryApplication, setPrimaryApplication] = useState("Commercial, Contracting, and Industrial Operations");
  const [dispatchLogistics, setDispatchLogistics] = useState("Direct workshop dispatch & turnkey GCC delivery");
  const [qualityAssurance, setQualityAssurance] = useState("100% Mill test certified & traceable carbon grade");
  const [engineeringSupport, setEngineeringSupport] = useState("Full in-house structural drafting & consultation");

  const [material, setMaterial] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [fabricationDetails, setFabricationDetails] = useState("");
  const [surfacePreparation, setSurfacePreparation] = useState("");
  const [testingCertifications, setTestingCertifications] = useState("");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.request(`/admin/products/${resolvedParams.id}`);
        const product = response.product;

        if (product) {
          setName(product.name || "");
          setDescription(product.description || "");
          setCategory(product.category || "Steel Fabrication");
          setPrice(product.price != null ? String(product.price) : "0");
          setDiscountPrice(product.discountPrice != null ? String(product.discountPrice) : "");
          setStock(product.stock != null ? String(product.stock) : "20");
          setSpecImage(product.specImage || "");

          setHasMultipleOptions(Boolean(product.hasMultipleOptions));
          setSwatchSingleName(product.swatchSingleName || "Single Standard");
          setSwatchBulkName(product.swatchBulkName || "5-Pack Contractors");
          setSwatchBulkPrice(product.swatchBulkPrice != null ? String(product.swatchBulkPrice) : "");
          setEnableSubscription(product.enableSubscription !== false);
          setSubscriptionDiscountPercent(product.subscriptionDiscountPercent != null ? String(product.subscriptionDiscountPercent) : "10");
          setPromoBadge(product.promoBadge || "FACTORY DIRECT");

          const fallbackSpec = INITIAL_PRODUCTS.find(
            (ip) => ip._id === product._id || ip.name?.toLowerCase() === (product.name || '').toLowerCase()
          );

          setMaterial(product.material || fallbackSpec?.material || "ASTM A36 / S275JR Structural Carbon Steel");
          setDimensions(product.dimensions || fallbackSpec?.dimensions || "Customizable H: 120 cm x W: 85 cm x D: 60 cm");
          setWeight(product.weight || fallbackSpec?.weight || "Approx. 35.0 kg");
          setFabricationDetails(product.fabricationDetails || fallbackSpec?.fabricationDetails || "Precision welded and finished entirely in-house at our Dammam facilities.");
          setSurfacePreparation(product.surfacePreparation || fallbackSpec?.surfacePreparation || "SA 2.5 Abrasive grit blasted with anti-corrosion epoxy primer and polyurethane finish.");
          setTestingCertifications(product.testingCertifications || fallbackSpec?.testingCertifications || "100% Mill Test Certified (MTR) & Non-Destructive Weld Inspection (NDT) SASO compliant.");
          
          if (Array.isArray(product.images) && product.images.length > 0) {
            setUploadedImages(product.images);
          } else if (product.image) {
            setUploadedImages([product.image]);
          } else {
            setUploadedImages(["/images/home/category_grid/warehouse.jpeg"]);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchProduct();
    }
  }, [resolvedParams.id]);

  // Image Upload Handlers
  const handleImageUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.fileUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setUploadedImages((prev) => {
        const realPrev = prev.filter(img => !img.startsWith('/images/home/'));
        return [...uploadedUrls, ...realPrev];
      });
      sessionDraftsRef.current.push(...uploadedUrls);
    } catch (err) {
      console.error("Error uploading images:", err);
      setError("Failed to upload images. Please try again.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setUploadedImages((prev) => {
        const realPrev = prev.filter(img => !img.startsWith('/images/home/'));
        return [newImageUrl.trim(), ...realPrev];
      });
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    const removedUrl = uploadedImages[index];
    if (removedUrl && (removedUrl.includes("ucarecdn.com") || removedUrl.startsWith("/uploads/"))) {
      fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: removedUrl }),
      }).catch((err) => console.error("Error deleting removed image from Uploadcare:", err));
      sessionDraftsRef.current = sessionDraftsRef.current.filter(url => url !== removedUrl);
    }
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsCoverImage = (index: number) => {
    if (index === 0) return;
    setUploadedImages((prev) => {
      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      return [selected, ...updated];
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploadingImages) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (uploadingImages) return;

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleClearSpecImage = () => {
    if (specImage && (specImage.includes("ucarecdn.com") || specImage.startsWith("/uploads/"))) {
      fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: specImage }),
      }).catch((err) => console.error("Error purging specImage from Uploadcare:", err));
      sessionDraftsRef.current = sessionDraftsRef.current.filter(url => url !== specImage);
    }
    setSpecImage("");
  };

  const handleSpecImageUpload = async (file: File) => {
    if (!file) return;
    setUploadingImages(true);
    setError(null);
    try {
      if (specImage && (specImage.includes("ucarecdn.com") || specImage.startsWith("/uploads/"))) {
        fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl: specImage }),
        }).catch((err) => console.error("Error purging replaced specImage from Uploadcare:", err));
        sessionDraftsRef.current = sessionDraftsRef.current.filter(url => url !== specImage);
      }

      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setSpecImage(data.fileUrl);
      sessionDraftsRef.current.push(data.fileUrl);
    } catch (err) {
      console.error("Error uploading specification image:", err);
      setError("Failed to upload specification diagram.");
    } finally {
      setUploadingImages(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Product Name is required");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError("Valid Price is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      isSavedRef.current = true;

      const updateData = {
        name: name.trim(),
        description: description.trim(),
        category,
        price: parseFloat(price) || 0,
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        stock: parseInt(stock) || 0,
        hasMultipleOptions,
        swatchSingleName: swatchSingleName.trim() || 'Single Standard',
        swatchBulkName: swatchBulkName.trim() || '5-Pack Contractors',
        swatchBulkPrice: swatchBulkPrice ? parseFloat(swatchBulkPrice) : (parseFloat(price) || 0) * 4.2,
        enableSubscription,
        subscriptionDiscountPercent: subscriptionDiscountPercent ? parseFloat(subscriptionDiscountPercent) : 10,
        promoBadge: promoBadge.trim() || 'FACTORY DIRECT',
        images: uploadedImages.length > 0 ? uploadedImages : ["/images/home/category_grid/warehouse.jpeg"],
        specImage: specImage.trim(),
        material: material.trim(),
        dimensions: dimensions.trim(),
        weight: weight.trim(),
        fabricationDetails: fabricationDetails.trim(),
        surfacePreparation: surfacePreparation.trim(),
        testingCertifications: testingCertifications.trim(),
      };

      await apiClient.request(`/admin/products`, {
        method: "PUT",
        body: JSON.stringify({
          productId: resolvedParams.id,
          ...updateData,
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1200);
    } catch (err) {
      console.error("Failed to update product:", err);
      setError(err instanceof Error ? err.message : "Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingWrapper}>
          <Loader2 className={styles.loadingSpinner} />
          <span>Loading product details...</span>
        </div>
      </div>
    );
  }

  const mainImage = uploadedImages[0] || "/images/home/category_grid/warehouse.jpeg";

  return (
    <form onSubmit={handleSubmit} className={styles.pageContainer}>
      {/* Top Sticky Universal Action Bar for Admin Controls */}
      <div className={styles.adminControlHeader}>
        <div className={styles.adminHeaderInner}>
          <div className={styles.adminHeaderLeft}>
            <button type="button" onClick={handleCancel} className={styles.backLink}>
              <ArrowLeft size={16} />
              <span>Back to Products</span>
            </button>
            <div className={styles.adminModeBadge}>
              <span className={styles.adminDot} />
              <span>LIVE PRODUCT EDITOR</span>
            </div>
          </div>

          <div className={styles.adminHeaderActions}>
            <button type="button" onClick={handleCancel} className={styles.headerCancelBtn}>
              Cancel
            </button>

            <button
              type="submit"
              className={styles.headerSaveBtn}
              disabled={saving || success}
            >
              {saving ? (
                <>
                  <Loader2 size={15} className={styles.spinner} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.errorAlertBar}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={styles.successAlertBar}>
          <CheckCircle size={16} />
          <span>Product updated successfully! Redirecting to dashboard...</span>
        </div>
      )}

      {/* Split Screen Layout (Matches Storefront Product Detail Page) */}
      <div className={styles.detailSplitLayout}>
          
          {/* LEFT COLUMN: Main Image Showcase & Horizontal Media Strip */}
          <div className={styles.imageColumn}>
            {/* Active Preview Frame Header */}
            <div className={styles.previewFrameHeader}>
              <span className={styles.previewFrameTitle}>
                PREVIEW: {selectedImageIndex === 0 ? "COVER IMAGE (PRIMARY)" : `GALLERY IMAGE ${selectedImageIndex + 1}`}
              </span>
              <span className={`${styles.frameStatusDot} ${selectedImageIndex === 0 ? styles.dotCover : styles.dotGallery}`} />
            </div>

            <div className={styles.imageCard}>
              <Image
                src={uploadedImages[selectedImageIndex] || uploadedImages[0] || "/images/home/category_grid/warehouse.jpeg"}
                alt={name || "Product Image"}
                fill
                priority
                className={styles.mainProductImage}
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Upload Overlay */}
              <div 
                className={`${styles.imageUploadOverlay} ${isDragOver ? styles.dragActive : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("image-upload-file")?.click()}
              >
                <Upload size={24} className={styles.overlayIcon} />
                <span className={styles.overlayTitle}>Click or Drop to Add Images</span>
                <span className={styles.overlaySub}>PNG, JPG, WebP up to 5MB</span>
                <input
                  type="file"
                  id="image-upload-file"
                  accept="image/*"
                  multiple
                  className={styles.hiddenFileInput}
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                />
              </div>
            </div>

            {/* Horizontal Thumbnail Gallery with Cover Badges */}
            <div className={styles.galleryControls}>
              <div className={styles.galleryHeaderRow}>
                <span className={styles.gallerySectionTitle}>PRODUCT MEDIA ({uploadedImages.length})</span>
                <span className={styles.galleryHelpText}>First image is the primary cover image</span>
              </div>

              <div className={styles.horizontalThumbnailRow}>
                {uploadedImages.map((img, idx) => {
                  const isCover = idx === 0;
                  const isSelected = idx === selectedImageIndex;

                  return (
                    <div 
                      key={idx} 
                      className={`${styles.thumbCardHorizontal} ${isSelected ? styles.selectedThumbCard : ""}`}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      <div className={styles.thumbImageContainer}>
                        <Image src={img} alt={`Media ${idx + 1}`} width={88} height={88} className={styles.thumbImg} />
                        
                        <div className={`${styles.roleBadgeTag} ${isCover ? styles.coverBadge : styles.galleryBadge}`}>
                          <span className={styles.badgeDot} />
                          <span>{isCover ? "COVER" : `IMG ${idx + 1}`}</span>
                        </div>

                        {uploadedImages.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(idx);
                              if (selectedImageIndex >= uploadedImages.length - 1) {
                                setSelectedImageIndex(Math.max(0, uploadedImages.length - 2));
                              }
                            }}
                            className={styles.removeImageBtn}
                            title="Remove image"
                          >
                            <X size={11} />
                          </button>
                        )}
                      </div>

                      <div className={styles.thumbQuickActions}>
                        {!isCover && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAsCoverImage(idx);
                              setSelectedImageIndex(0);
                            }}
                            className={styles.actionPillBtn}
                          >
                            Set Cover
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.urlInputRow}>
                <ImageIcon size={14} className={styles.urlIcon} />
                <input
                  type="text"
                  placeholder="Paste external Image URL..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className={styles.urlInputField}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className={styles.addUrlBtn}
                  disabled={!newImageUrl.trim()}
                >
                  <Plus size={14} />
                  <span>Add URL</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Product Details & Buy Box Editor */}
          <div className={styles.infoColumn}>
            
            {/* Category Dropdown Pill */}
            <div className={styles.categorySelectWrapper}>
              <span className={styles.categoryLabelTag}>CATEGORY:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.categoryDropdown}
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Editable Title */}
            <div className={styles.titleInputGroup}>
              <label htmlFor="product-title" className={styles.inputMicroLabel}>PRODUCT TITLE</label>
              <input
                id="product-title"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product title..."
                className={styles.productTitleInput}
                required
              />
            </div>

            {/* Redesigned Integrated Buy Box Editor (Matches Storefront Buy Box) */}
            <div className={styles.promoBuyBox}>
              {/* Price, Discount & Stock Input Matrix */}
              <div className={styles.buyBoxPriceMatrix}>
                <div className={styles.fieldBlock}>
                  <label htmlFor="product-price" className={styles.fieldLabel}>REGULAR PRICE (SAR)</label>
                  <div className={styles.priceInputWrapper}>
                    <span className={styles.currencyPrefix}>SAR</span>
                    <input
                      id="product-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className={styles.priceInput}
                      required
                    />
                  </div>
                </div>

                <div className={styles.fieldBlock}>
                  <label htmlFor="edit-product-discount" className={styles.fieldLabel}>DISCOUNT PRICE (SAR, OPTIONAL)</label>
                  <div className={styles.priceInputWrapper}>
                    <span className={styles.currencyPrefix}>SAR</span>
                    <input
                      id="edit-product-discount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      placeholder="e.g. 199.00"
                      className={styles.priceInput}
                    />
                  </div>
                </div>

                <div className={styles.fieldBlock}>
                  <label htmlFor="product-stock" className={styles.fieldLabel}>UNITS IN STOCK</label>
                  <input
                    id="product-stock"
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="20"
                    className={styles.stockInput}
                    required
                  />
                </div>
              </div>

              {/* PROMO BADGE FIELD */}
              <div className={styles.fieldBlock}>
                <label className={styles.fieldLabel}>PROMO BADGE CALLOUT TEXT</label>
                <input
                  type="text"
                  value={promoBadge}
                  onChange={(e) => setPromoBadge(e.target.value)}
                  placeholder="e.g. FACTORY DIRECT / FLASH DEAL / CLEARANCE"
                  className={styles.stockInput}
                />
              </div>

              {/* PACK SIZE OPTIONS & BULK PRICING */}
              <div className={styles.buyBoxSubSectionTitle}>Product Option Mode (Single vs Multiple Options)</div>
              <div className={styles.buyBoxPriceMatrix} style={{ marginBottom: '16px' }}>
                <div className={styles.fieldBlock} style={{ gridColumn: 'span 3' }}>
                  <label className={styles.fieldLabel}>CARD &amp; STOREFRONT OPTION TYPE</label>
                  <select
                    value={hasMultipleOptions ? "multiple" : "single"}
                    onChange={(e) => setHasMultipleOptions(e.target.value === "multiple")}
                    className={styles.stockInput}
                    style={{ background: '#ffffff', color: '#0f172a', fontWeight: 'bold' }}
                  >
                    <option value="single">Single Product (Direct "+ Add to Cart" Button on Store Cards)</option>
                    <option value="multiple">Multiple Options Product (Variant Swatches &amp; "Options" Button on Store Cards)</option>
                  </select>
                </div>
              </div>

              {hasMultipleOptions && (
                <>
                  <div className={styles.buyBoxSubSectionTitle}>Pack Size Swatches &amp; Option Pricing</div>
                  <div className={styles.buyBoxPriceMatrix}>
                    <div className={styles.fieldBlock}>
                      <label className={styles.fieldLabel}>OPTION 1 NAME (SINGLE PACK)</label>
                      <input
                        type="text"
                        value={swatchSingleName}
                        onChange={(e) => setSwatchSingleName(e.target.value)}
                        placeholder="Single Standard"
                        className={styles.stockInput}
                      />
                    </div>

                    <div className={styles.fieldBlock}>
                      <label className={styles.fieldLabel}>OPTION 2 NAME (BULK PACK)</label>
                      <input
                        type="text"
                        value={swatchBulkName}
                        onChange={(e) => setSwatchBulkName(e.target.value)}
                        placeholder="5-Pack Contractors"
                        className={styles.stockInput}
                      />
                    </div>

                    <div className={styles.fieldBlock}>
                      <label className={styles.fieldLabel}>BULK PACK PRICE (SAR)</label>
                      <div className={styles.priceInputWrapper}>
                        <span className={styles.currencyPrefix}>SAR</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={swatchBulkPrice}
                          onChange={(e) => setSwatchBulkPrice(e.target.value)}
                          placeholder="Auto (4.2x price)"
                          className={styles.priceInput}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* MONTHLY AUTO-RESTOCK SUBSCRIPTION OPTIONS */}
              <div className={styles.buyBoxSubSectionTitle}>Monthly Auto-Restock Subscription</div>

              <div className={styles.buyBoxPriceMatrix}>
                <div className={styles.fieldBlock} style={{ justifyContent: 'center' }}>
                  <label className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={enableSubscription}
                      onChange={(e) => setEnableSubscription(e.target.checked)}
                      className={styles.checkboxInput}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#111111' }}>Enable Monthly Auto-Restock</span>
                  </label>
                </div>

                <div className={styles.fieldBlock}>
                  <label className={styles.fieldLabel}>SUBSCRIPTION DISCOUNT (% OFF)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={subscriptionDiscountPercent}
                    onChange={(e) => setSubscriptionDiscountPercent(e.target.value)}
                    placeholder="10"
                    className={styles.stockInput}
                  />
                </div>
              </div>
            </div>

            {/* Editable Description Block */}
            <div className={styles.descriptionInputGroup}>
              <label htmlFor="product-description" className={styles.inputMicroLabel}>PRODUCT DESCRIPTION</label>
              <textarea
                id="product-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter detailed industrial asset description..."
                rows={4}
                className={styles.descriptionTextarea}
              />
            </div>

          </div>
        </div>

        {/* Product Tabs Section (General / Specifications / Details) */}
        <div className={styles.productTabsSection}>
          <div className={styles.tabsHeaderContainer}>
            <div className={styles.tabsList}>
              <button
                type="button"
                className={`${styles.tabHeaderButton} ${activeTab === 'general' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('general')}
              >
                General
              </button>
              <button
                type="button"
                className={`${styles.tabHeaderButton} ${activeTab === 'specs' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Specifications
              </button>
              <button
                type="button"
                className={`${styles.tabHeaderButton} ${activeTab === 'details' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
            </div>
          </div>

          <div className={styles.tabContentContainer}>
            {activeTab === 'general' && (
              <div className={styles.tabContentBlock}>
                <div className={styles.specsTabSectionLayout}>
                  <div className={styles.specsLeftCol}>
                    <h3 className={styles.specsSectionTitle}>General Parameters</h3>
                  </div>

                  <div className={styles.specsRightCol}>
                    <div className={styles.specsTable}>
                      <div className={styles.specsTableRow}>
                        <div className={styles.specsTableLabel}>DIVISION</div>
                        <input
                          type="text"
                          value={division}
                          onChange={(e) => setDivision(e.target.value)}
                          className={styles.tableInput}
                        />
                      </div>
                      <div className={styles.specsTableRow}>
                        <div className={styles.specsTableLabel}>PRIMARY APPLICATION</div>
                        <input
                          type="text"
                          value={primaryApplication}
                          onChange={(e) => setPrimaryApplication(e.target.value)}
                          className={styles.tableInput}
                        />
                      </div>
                      <div className={styles.specsTableRow}>
                        <div className={styles.specsTableLabel}>DISPATCH &amp; LOGISTICS</div>
                        <input
                          type="text"
                          value={dispatchLogistics}
                          onChange={(e) => setDispatchLogistics(e.target.value)}
                          className={styles.tableInput}
                        />
                      </div>
                      <div className={styles.specsTableRow}>
                        <div className={styles.specsTableLabel}>QUALITY ASSURANCE</div>
                        <input
                          type="text"
                          value={qualityAssurance}
                          onChange={(e) => setQualityAssurance(e.target.value)}
                          className={styles.tableInput}
                        />
                      </div>
                      <div className={styles.specsTableRow}>
                        <div className={styles.specsTableLabel}>ENGINEERING SUPPORT</div>
                        <input
                          type="text"
                          value={engineeringSupport}
                          onChange={(e) => setEngineeringSupport(e.target.value)}
                          className={styles.tableInput}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className={styles.tabContentBlock}>
                <div className={styles.specsTabSectionLayout}>
                  <div className={styles.specsLeftCol}>
                    <h3 className={styles.specsSectionTitle}>Technical Specifications</h3>
                    <p className={styles.specSubtext}>Configure Material, Dimensions, Weight, Fabrication, Surface Prep, and Testing Certifications.</p>
                  </div>
                  <div className={styles.specsRightCol}>
                    <div className={styles.specsTable}>
                      <div className={styles.specsTableRow}>
                        <div className={styles.specsTableLabel}>MATERIAL</div>
                        <input
                          type="text"
                          value={material}
                          onChange={(e) => setMaterial(e.target.value)}
                          placeholder="e.g. ASTM A36 Structural Carbon Steel / Grade A Hardwood"
                          className={styles.tableInput}
                        />
                      </div>
                      <div className={styles.specsTableRow}>
                        <div className={styles.specsTableLabel}>DIMENSIONS</div>
                        <input
                          type="text"
                          value={dimensions}
                          onChange={(e) => setDimensions(e.target.value)}
                          placeholder="e.g. H: 120 cm x W: 85 cm x D: 60 cm (Customizable)"
                          className={styles.tableInput}
                        />
                      </div>
                      <div className={styles.specsTableRow}>
                        <div className={styles.specsTableLabel}>WEIGHT</div>
                        <input
                          type="text"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="e.g. Approx. 28 kg"
                          className={styles.tableInput}
                        />
                      </div>
                      <div className={styles.specsTableRow} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                        <div className={styles.specsTableLabel}>FABRICATION DETAILS</div>
                        <textarea
                          value={fabricationDetails}
                          onChange={(e) => setFabricationDetails(e.target.value)}
                          placeholder="e.g. Precision welded and finished entirely in-house at our Dammam facilities..."
                          rows={3}
                          className={styles.descriptionTextarea}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className={styles.specsTableRow} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                        <div className={styles.specsTableLabel}>SURFACE PREPARATION</div>
                        <textarea
                          value={surfacePreparation}
                          onChange={(e) => setSurfacePreparation(e.target.value)}
                          placeholder="e.g. Treated with commercial abrasive grit blasting (SA 2.5 profile)..."
                          rows={3}
                          className={styles.descriptionTextarea}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className={styles.specsTableRow} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                        <div className={styles.specsTableLabel}>TESTING &amp; CERTIFICATIONS</div>
                        <textarea
                          value={testingCertifications}
                          onChange={(e) => setTestingCertifications(e.target.value)}
                          placeholder="e.g. Fully tested and certified for safety compliance..."
                          rows={3}
                          className={styles.descriptionTextarea}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.specsTabSectionLayout} style={{ marginTop: '32px' }}>
                  <div className={styles.specsLeftCol}>
                    <h3 className={styles.specsSectionTitle}>Technical Diagram</h3>
                    <p className={styles.specSubtext}>Upload a technical drawing, CAD diagram, or specification schematic for this product.</p>
                  </div>
                  <div className={styles.specsRightCol}>
                    <div className={styles.specImageEditorBox}>
                      <div className={styles.specSchematicWrapper}>
                        {specImage ? (
                          <Image
                            src={specImage}
                            alt="Product Technical Schematic"
                            width={500}
                            height={280}
                            unoptimized
                            className={styles.schematicImage}
                          />
                        ) : (
                          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                            No Technical Diagram Uploaded (Optional)
                          </div>
                        )}
                        <div 
                          className={styles.specUploadOverlay}
                          onClick={() => document.getElementById("spec-image-file-edit")?.click()}
                        >
                          <Upload size={22} />
                          <span>Upload Technical Diagram</span>
                          <input
                            type="file"
                            id="spec-image-file-edit"
                            accept="image/*"
                            className={styles.hiddenFileInput}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleSpecImageUpload(e.target.files[0]);
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className={styles.specUrlInputRow}>
                        <ImageIcon size={14} className={styles.urlIcon} />
                        <input
                          type="text"
                          placeholder="Or paste Specification Diagram Image URL..."
                          value={specImage}
                          onChange={(e) => setSpecImage(e.target.value)}
                          className={styles.urlInputField}
                        />
                        {specImage && (
                          <button
                            type="button"
                            onClick={handleClearSpecImage}
                            className={styles.clearSpecBtn}
                          >
                            Clear Image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className={styles.tabContentBlock}>
                <div className={styles.specsTabSectionLayout}>
                  <div className={styles.specsLeftCol}>
                    <h3 className={styles.specsSectionTitle}>Manufacturer Details</h3>
                  </div>
                  <div className={styles.specsRightCol}>
                    <p className={styles.detailsParagraph}>
                      Saudi Fab Store Group certifies that all fabricated steel components and contracting equipment meet rigorous ISO 9001:2015 quality standards. Mill test reports and load compliance documentation are issued with factory dispatch.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    </form>
  );
}