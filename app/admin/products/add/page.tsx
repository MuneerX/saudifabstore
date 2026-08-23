"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Plus, 
  Factory, 
  ShieldCheck, 
  BadgeCheck, 
  Star,
  Image as ImageIcon
} from "lucide-react";
import styles from "./page.module.css";
import apiClient from "@/lib/apiClient";

const CATEGORY_OPTIONS = [
  { value: "Steel Fabrication", label: "Steel Fabrication" },
  { value: "Industrial Coatings", label: "Industrial Coatings" },
  { value: "Smart Woodworks", label: "Smart Woodworks" },
  { value: "Safety & Trading", label: "Safety & Trading" },
  { value: "Forklift Attachments", label: "Forklift Attachments" },
  { value: "Warehouse & Logistics", label: "Warehouse & Logistics" },
  { value: "Safety Equipment", label: "Safety Equipment" },
  { value: "Lifting Equipment", label: "Lifting Equipment" },
  { value: "Hardware & Piping", label: "Hardware & Piping" },
];

export default function AddProductPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("20");
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

  const [material, setMaterial] = useState("ASTM A36 / S275JR Structural Carbon Steel");
  const [dimensions, setDimensions] = useState("Customizable H: 120 cm x W: 85 cm x D: 60 cm");
  const [weight, setWeight] = useState("Approx. 35.0 kg");
  const [fabricationDetails, setFabricationDetails] = useState("Precision MIG/TIG welded and stress-relieved structural assembly at our Dammam facilities.");
  const [surfacePreparation, setSurfacePreparation] = useState("SA 2.5 Abrasive grit blasted with anti-corrosion epoxy primer and polyurethane finish.");
  const [testingCertifications, setTestingCertifications] = useState("100% Mill Test Certified (MTR) & Non-Destructive Weld Inspection (NDT) SASO compliant.");

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

  const setAsHoverImage = (index: number) => {
    if (index === 1) return;
    setUploadedImages((prev) => {
      if (prev.length < 2) return prev;
      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      const primary = updated[0];
      const rest = updated.slice(1);
      return [primary, selected, ...rest];
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

  const handleSpecImageUpload = async (file: File) => {
    if (!file) return;
    setUploadingImages(true);
    setError(null);
    try {
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
      setIsSubmitting(true);
      setError(null);
      isSavedRef.current = true;

      const productPayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        images: uploadedImages.length > 0 ? uploadedImages : ["/images/home/category_grid/container_3.jpeg"],
        specImage: specImage.trim(),
        material: material.trim(),
        dimensions: dimensions.trim(),
        weight: weight.trim(),
        fabricationDetails: fabricationDetails.trim(),
        surfacePreparation: surfacePreparation.trim(),
        testingCertifications: testingCertifications.trim(),
      };

      await apiClient.createAdminProduct(productPayload);

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1200);
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err instanceof Error ? err.message : "Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mainImage = uploadedImages[0] || "/images/home/category_grid/container_3.jpeg";

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
              <span>ADD NEW PRODUCT</span>
            </div>
          </div>

          <div className={styles.adminHeaderActions}>
            <button type="button" onClick={handleCancel} className={styles.headerCancelBtn}>
              Cancel
            </button>

            <button
              type="submit"
              className={styles.headerSaveBtn}
              disabled={isSubmitting || success}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className={styles.spinner} />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus size={15} />
                  <span>Create Product</span>
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
          <span>Product created successfully! Redirecting to dashboard...</span>
        </div>
      )}

      {/* Split Screen Layout (Matches Storefront Product Detail Page) */}
      <div className={styles.detailSplitLayout}>
          
          {/* LEFT COLUMN: Main Image Showcase & Horizontal Media Strip */}
          <div className={styles.imageColumn}>
            {/* Active Preview Frame Header */}
            <div className={styles.previewFrameHeader}>
              <span className={styles.previewFrameTitle}>
                PREVIEW: {selectedImageIndex === 0 ? "COVER IMAGE (CARD VIEW)" : selectedImageIndex === 1 ? "HOVER IMAGE (CARD HOVER)" : `GALLERY IMAGE ${selectedImageIndex + 1}`}
              </span>
              <span className={`${styles.frameStatusDot} ${selectedImageIndex === 0 ? styles.dotCover : selectedImageIndex === 1 ? styles.dotHover : styles.dotGallery}`} />
            </div>

            <div className={styles.imageCard}>
              <Image
                src={uploadedImages[selectedImageIndex] || uploadedImages[0] || "/images/home/category_grid/container_3.jpeg"}
                alt={name || "New Product Image"}
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
                onClick={() => document.getElementById("image-upload-file-add")?.click()}
              >
                <Upload size={28} className={styles.overlayIcon} />
                <span className={styles.overlayTitle}>Click or Drop Product Image Here</span>
                <span className={styles.overlaySub}>PNG, JPG, WebP up to 5MB</span>
                <input
                  type="file"
                  id="image-upload-file-add"
                  accept="image/*"
                  multiple
                  className={styles.hiddenFileInput}
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                />
              </div>
            </div>

            {/* Horizontal Thumbnail Gallery with Cover & Hover Badges */}
            <div className={styles.galleryControls}>
              <div className={styles.galleryHeaderRow}>
                <span className={styles.gallerySectionTitle}>PRODUCT MEDIA ({uploadedImages.length})</span>
                <span className={styles.galleryHelpText}>Horizontal order determines Cover &amp; Hover state</span>
              </div>

              <div className={styles.horizontalThumbnailRow}>
                {uploadedImages.map((img, idx) => {
                  const isCover = idx === 0;
                  const isHover = idx === 1;
                  const isSelected = idx === selectedImageIndex;

                  return (
                    <div 
                      key={idx} 
                      className={`${styles.thumbCardHorizontal} ${isSelected ? styles.selectedThumbCard : ""}`}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      <div className={styles.thumbImageContainer}>
                        <Image src={img} alt={`Media ${idx + 1}`} width={88} height={88} className={styles.thumbImg} />
                        
                        <div className={`${styles.roleBadgeTag} ${isCover ? styles.coverBadge : isHover ? styles.hoverBadge : styles.galleryBadge}`}>
                          <span className={styles.badgeDot} />
                          <span>{isCover ? "COVER" : isHover ? "HOVER" : `IMG ${idx + 1}`}</span>
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
                        {!isHover && uploadedImages.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAsHoverImage(idx);
                              setSelectedImageIndex(1);
                            }}
                            className={styles.actionPillBtn}
                          >
                            Set Hover
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
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Editable Title */}
            <div className={styles.titleInputGroup}>
              <label htmlFor="add-product-title" className={styles.inputMicroLabel}>PRODUCT TITLE</label>
              <input
                id="add-product-title"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter new product title..."
                className={styles.productTitleInput}
                required
              />
            </div>

            {/* Integrated Buy Box Editor */}
            <div className={styles.promoBuyBox}>
              <div className={styles.promoTopRow}>
                <div className={styles.promoLeft}>
                  <span className={styles.promoGreenText}>FACTORY DIRECT</span>
                  <h4 className={styles.promoHeading}>Direct Manufacturer Rate</h4>
                </div>
                <div className={styles.promoRight}>
                  <Image
                    src="/images/iso.svg"
                    alt="ISO Certified Quality"
                    width={52}
                    height={52}
                    className={styles.isoBadgeImage}
                  />
                </div>
              </div>

              {/* Price & Stock Input Matrix */}
              <div className={styles.buyBoxPriceMatrix}>
                <div className={styles.fieldBlock}>
                  <label htmlFor="add-product-price" className={styles.fieldLabel}>PRICE (€)</label>
                  <div className={styles.priceInputWrapper}>
                    <span className={styles.currencyPrefix}>€</span>
                    <input
                      id="add-product-price"
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
                  <label htmlFor="add-product-stock" className={styles.fieldLabel}>UNITS IN STOCK</label>
                  <input
                    id="add-product-stock"
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

              <span className={styles.promoBottomText}>
                Direct factory dispatch &amp; certified mill testing included
              </span>
            </div>

            {/* Editable Description Block */}
            <div className={styles.descriptionInputGroup}>
              <label htmlFor="add-product-description" className={styles.inputMicroLabel}>PRODUCT DESCRIPTION</label>
              <textarea
                id="add-product-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter detailed industrial asset description..."
                rows={4}
                className={styles.descriptionTextarea}
              />
            </div>

            {/* Precision Industrial Specification Rail */}
            <div className={styles.industrialFactStrip}>
              <div className={styles.factItem}>
                <Factory size={15} strokeWidth={1.8} className={styles.factIcon} />
                <span className={styles.factText}>Dammam Fabrication</span>
              </div>
              <div className={styles.factDivider} />
              <div className={styles.factItem}>
                <ShieldCheck size={15} strokeWidth={1.8} className={styles.factIcon} />
                <span className={styles.factText}>1-Year Warranty</span>
              </div>
              <div className={styles.factDivider} />
              <div className={styles.factItem}>
                <BadgeCheck size={15} strokeWidth={1.8} className={styles.factIcon} />
                <span className={styles.factText}>ISO 9001:2015</span>
              </div>
              <div className={styles.factDivider} />
              <div className={styles.factItem}>
                <Star size={15} strokeWidth={1.8} className={styles.factIcon} />
                <span className={styles.factText}>4.9/5.0 Client Rating</span>
              </div>
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

                    <div className={styles.specImageEditorBox} style={{ marginTop: '24px' }}>
                      <div className={styles.specSchematicWrapper}>
                        <Image
                          src={specImage || uploadedImages[0] || "/images/home/about/steel-raw.jpg"}
                          alt="Product Technical Schematic"
                          width={500}
                          height={280}
                          unoptimized
                          className={styles.schematicImage}
                        />
                        <div 
                          className={styles.specUploadOverlay}
                          onClick={() => document.getElementById("spec-image-file-add")?.click()}
                        >
                          <Upload size={22} />
                          <span>Upload Technical Diagram</span>
                          <input
                            type="file"
                            id="spec-image-file-add"
                            accept="image/*"
                            className={styles.hiddenFileInput}
                            onChange={(e) => e.target.files?.[0] && handleSpecImageUpload(e.target.files[0])}
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
                            onClick={() => setSpecImage("")}
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
