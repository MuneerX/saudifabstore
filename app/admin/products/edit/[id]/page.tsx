"use client";

import React, { useState, useEffect, use } from "react";
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

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'specs' | 'details'>('general');

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
          setPrice(product.price !== undefined ? product.price.toString() : "0");
          setDiscountPrice(product.discountPrice !== undefined ? product.discountPrice.toString() : "");
          setStock(product.stock !== undefined ? product.stock.toString() : "20");
          setSpecImage(product.specImage || "");
          
          if (Array.isArray(product.images) && product.images.length > 0) {
            setUploadedImages(product.images);
          } else if (product.image) {
            setUploadedImages([product.image]);
          } else {
            setUploadedImages(["/images/home/category_grid/container_3.jpeg"]);
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
      setUploadedImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error("Error uploading images:", err);
      setError("Failed to upload images. Please try again.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setUploadedImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
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

      const updateData = {
        name: name.trim(),
        description: description.trim(),
        category,
        price: parseFloat(price) || 0,
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        stock: parseInt(stock) || 0,
        images: uploadedImages.length > 0 ? uploadedImages : ["/images/home/category_grid/container_3.jpeg"],
        specImage: specImage.trim(),
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

  const mainImage = uploadedImages[0] || "/images/home/category_grid/container_3.jpeg";

  return (
    <form onSubmit={handleSubmit} className={styles.pageContainer}>
      {/* Top Sticky Universal Action Bar for Admin Controls */}
      <div className={styles.adminControlHeader}>
        <div className={styles.adminHeaderInner}>
          <div className={styles.adminHeaderLeft}>
            <Link href="/admin/products" className={styles.backLink}>
              <ArrowLeft size={16} />
              <span>Back to Products</span>
            </Link>
            <div className={styles.adminModeBadge}>
              <span className={styles.adminDot} />
              <span>LIVE PRODUCT EDITOR</span>
            </div>
          </div>

          <div className={styles.adminHeaderActions}>
            <Link href="/admin/products" className={styles.headerCancelLink}>
              <button type="button" className={styles.headerCancelBtn}>
                Cancel
              </button>
            </Link>

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
                PREVIEW: {selectedImageIndex === 0 ? "COVER IMAGE (CARD VIEW)" : selectedImageIndex === 1 ? "HOVER IMAGE (CARD HOVER)" : `GALLERY IMAGE ${selectedImageIndex + 1}`}
              </span>
              <span className={`${styles.frameStatusDot} ${selectedImageIndex === 0 ? styles.dotCover : selectedImageIndex === 1 ? styles.dotHover : styles.dotGallery}`} />
            </div>

            <div className={styles.imageCard}>
              <Image
                src={uploadedImages[selectedImageIndex] || uploadedImages[0] || "/images/home/category_grid/container_3.jpeg"}
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
                  <label htmlFor="product-price" className={styles.fieldLabel}>PRICE (€)</label>
                  <div className={styles.priceInputWrapper}>
                    <span className={styles.currencyPrefix}>€</span>
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
                  <label htmlFor="product-discount-price" className={styles.fieldLabel}>DISCOUNT PRICE (€)</label>
                  <div className={styles.priceInputWrapper}>
                    <span className={styles.currencyPrefix}>€</span>
                    <input
                      id="product-discount-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      placeholder="Optional"
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
                    placeholder="0"
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
                    <h3 className={styles.specsSectionTitle}>Technical Diagram</h3>
                    <p className={styles.specSubtext}>Upload a technical drawing, CAD diagram, or specification schematic for this product.</p>
                  </div>
                  <div className={styles.specsRightCol}>
                    <div className={styles.specImageEditorBox}>
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
                          onClick={() => document.getElementById("spec-image-file-edit")?.click()}
                        >
                          <Upload size={22} />
                          <span>Upload Technical Diagram</span>
                          <input
                            type="file"
                            id="spec-image-file-edit"
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
                      Brooq Al Khalij Group certifies that all fabricated steel components and contracting equipment meet rigorous ISO 9001:2015 quality standards. Mill test reports and load compliance documentation are issued with factory dispatch.
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