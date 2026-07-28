"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  ChevronDown,
  RefreshCw,
  Loader2,
  Upload
} from "lucide-react";
import styles from "./page.module.css";
import apiClient from "@/lib/apiClient";

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

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    sku: "",
    tags: [] as string[],
    sizes: [] as string[],
    colors: [] as string[]
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);

  // Load product data when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.request(`/admin/products/${resolvedParams.id}`);
        const product = response.product;

        if (product) {
          setProductData({
            name: product.name || "",
            description: product.description || "",
            category: product.category || "",
            price: product.price?.toString() || "",
            discountPrice: product.discountPrice?.toString() || "",
            stock: product.stock?.toString() || "",
            sku: product.sku || "",
            tags: product.tags || [],
            sizes: product.sizes || [],
            colors: product.colors || []
          });
          setUploadedImages(product.images || []);
          setDescriptionCharCount(product.description?.length || 0);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchProduct();
    }
  }, [resolvedParams.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length <= 230) {
      setProductData(prev => ({
        ...prev,
        description: value
      }));
      setDescriptionCharCount(value.length);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddSize = () => {
    if (newSize.trim() && !productData.sizes.includes(newSize.trim())) {
      setProductData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }));
      setNewSize("");
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size !== sizeToRemove)
    }));
  };

  const handleAddColor = () => {
    if (newColor.trim() && !productData.colors.includes(newColor.trim())) {
      setProductData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }));
      setNewColor("");
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }));
  };

  const handleImageUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.fileUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleImageUpload(files);
      e.target.value = '';
    }
  };

  const handleUploadAreaClick = () => {
    if (!uploadingImages) {
      document.getElementById('image-upload')?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploadingImages) {
      setIsDragOver(true);
    }
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

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        name: productData.name,
        description: productData.description,
        category: productData.category,
        price: parseFloat(productData.price),
        discountPrice: productData.discountPrice ? parseFloat(productData.discountPrice) : undefined,
        stock: parseInt(productData.stock),
        sku: productData.sku,
        tags: productData.tags,
        sizes: productData.sizes,
        colors: productData.colors,
        images: uploadedImages
      };

      (Object.keys(updateData) as Array<keyof typeof updateData>).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      await apiClient.request(`/admin/products`, {
        method: 'PUT',
        body: JSON.stringify({
          productId: resolvedParams.id,
          ...updateData
        })
      });

      router.push('/admin/products');
    } catch (err) {
      console.error('Failed to update product:', err);
      setError("Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.editProductPage}>
        <div className={styles.header}>
          <div className={styles.skeletonText} style={{ width: '150px' }}></div>
          <div className={styles.skeletonTitle}></div>
        </div>

        <div className={styles.formGrid}>
          {/* Product Information Skeleton */}
          <Card className={styles.formCard}>
            <CardHeader>
              <div className={styles.skeletonTitle} style={{ width: '180px' }}></div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.formGroup}>
                <div className={styles.skeletonText} style={{ width: '120px', height: '14px' }}></div>
                <div className={styles.skeletonInput}></div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.skeletonText} style={{ width: '80px', height: '14px' }}></div>
                <div className={styles.skeletonTextarea}></div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <div className={styles.skeletonText} style={{ width: '70px', height: '14px' }}></div>
                  <div className={styles.skeletonSelect}></div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.skeletonText} style={{ width: '50px', height: '14px' }}></div>
                  <div className={styles.skeletonInput}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing and Inventory Skeleton */}
          <Card className={styles.formCard}>
            <CardHeader>
              <div className={styles.skeletonTitle} style={{ width: '160px' }}></div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <div className={styles.skeletonText} style={{ width: '60px', height: '14px' }}></div>
                  <div className={styles.skeletonInput}></div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.skeletonText} style={{ width: '120px', height: '14px' }}></div>
                  <div className={styles.skeletonInput}></div>
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.skeletonText} style={{ width: '130px', height: '14px' }}></div>
                <div className={styles.skeletonInput}></div>
              </div>
            </CardContent>
          </Card>

          {/* Media Skeleton */}
          <Card className={styles.formCard}>
            <CardHeader>
              <div className={styles.skeletonTitle} style={{ width: '120px' }}></div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.uploadArea}>
                <div className={styles.skeletonIcon}></div>
                <div className={styles.skeletonText} style={{ width: '150px', height: '16px' }}></div>
                <div className={styles.skeletonText} style={{ width: '120px', height: '14px' }}></div>
                <div className={styles.skeletonButton}></div>
              </div>
              <div className={styles.imagePreview}>
                <div className={styles.previewItem}>
                  <div className={styles.skeletonImage}></div>
                  <div className={styles.skeletonButton} style={{ width: '30px', height: '30px' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags Skeleton */}
          <Card className={styles.formCard}>
            <CardHeader>
              <div className={styles.skeletonTitle} style={{ width: '50px' }}></div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.formGroup}>
                <div className={styles.skeletonText} style={{ width: '80px', height: '14px' }}></div>
                <div className={styles.tagInputContainer}>
                  <div className={styles.skeletonInput}></div>
                  <div className={styles.skeletonButton} style={{ width: '40px', height: '40px' }}></div>
                </div>
                <div className={styles.tagsContainer}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.skeletonTag}></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sizes Skeleton */}
          <Card className={styles.formCard}>
            <CardHeader>
              <div className={styles.skeletonTitle} style={{ width: '60px' }}></div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.formGroup}>
                <div className={styles.skeletonText} style={{ width: '80px', height: '14px' }}></div>
                <div className={styles.tagInputContainer}>
                  <div className={styles.skeletonInput}></div>
                  <div className={styles.skeletonButton} style={{ width: '40px', height: '40px' }}></div>
                </div>
                <div className={styles.tagsContainer}>
                  {[1, 2].map((i) => (
                    <div key={i} className={styles.skeletonTag}></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colors Skeleton */}
          <Card className={styles.formCard}>
            <CardHeader>
              <div className={styles.skeletonTitle} style={{ width: '70px' }}></div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.formGroup}>
                <div className={styles.skeletonText} style={{ width: '80px', height: '14px' }}></div>
                <div className={styles.tagInputContainer}>
                  <div className={styles.skeletonInput}></div>
                  <div className={styles.skeletonButton} style={{ width: '40px', height: '40px' }}></div>
                </div>
                <div className={styles.tagsContainer}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={styles.skeletonTag}></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className={styles.actionCard}>
          <CardFooter className={styles.cardFooter}>
            <div className={styles.skeletonButton}></div>
            <div className={styles.skeletonButton}></div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.editProductPage}>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editProductPage}>
      <div className={styles.header}>
        <Link href="/admin/products" className={styles.backLink}>
          <ArrowLeft className={styles.backIcon} aria-hidden="true" />
          Back to Products
        </Link>
        <h1 className={styles.title}>Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          {/* Product Information */}
          <Card className={styles.formCard}>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Product Name *</label>
                <Input
                  id="name"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                  aria-describedby="name-error"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={productData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter product description"
                  rows={4}
                  className={styles.textarea}
                  aria-describedby="description-error"
                  maxLength={230}
                />
                <div className={styles.charCounter}>
                  {descriptionCharCount}/230 characters
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category *</label>
                  <CustomSelect
                    value={productData.category}
                    onChange={(value) => setProductData(prev => ({ ...prev, category: value }))}
                    options={[
                      { value: "t-shirts", label: "T-Shirts" },
                      { value: "hoodies", label: "Hoodies" },
                      { value: "shorts", label: "Shorts" },
                      { value: "jeans", label: "Jeans" },
                      { value: "accessories", label: "Accessories" }
                    ]}
                    placeholder="Select category"
                    className={styles.categorySelect}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="sku" className={styles.label}>SKU</label>
                  <Input
                    id="sku"
                    name="sku"
                    value={productData.sku}
                    onChange={handleInputChange}
                    placeholder="Enter SKU"
                    aria-describedby="sku-error"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing and Inventory */}
          <Card className={styles.formCard}>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="price" className={styles.label}>Price *</label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={productData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    aria-describedby="price-error"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="discountPrice" className={styles.label}>Discount Price</label>
                  <Input
                    id="discountPrice"
                    name="discountPrice"
                    type="number"
                    value={productData.discountPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    aria-describedby="discountPrice-error"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="stock" className={styles.label}>Stock Quantity *</label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={productData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  required
                  aria-describedby="stock-error"
                />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card className={styles.formCard}>
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div
                className={`${styles.uploadArea} ${isDragOver ? styles.dragOver : ''}`}
                onClick={handleUploadAreaClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ cursor: uploadingImages ? 'not-allowed' : 'pointer' }}
              >
                <Upload className={styles.uploadIcon} aria-hidden="true" />
                <p>{isDragOver ? 'Drop images here' : 'Upload product images'}</p>
                <p className={styles.uploadHint}>
                  {isDragOver ? 'Release to upload' : 'PNG, JPG up to 5MB • Drag & drop or click to browse'}
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className={styles.fileInput}
                  id="image-upload"
                  disabled={uploadingImages}
                />
                <label htmlFor="image-upload">
                  <Button
                    type="button"
                    variant="outline"
                    className={styles.uploadButton}
                    disabled={uploadingImages}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {uploadingImages ? (
                      <>
                        <Loader2 className={styles.spinnerIcon} />
                        Uploading...
                      </>
                    ) : (
                      'Select Files'
                    )}
                  </Button>
                </label>
              </div>

              {uploadedImages.length > 0 && (
                <div className={styles.uploadedImages}>
                  <h4>Uploaded Images ({uploadedImages.length})</h4>
                  <div className={styles.imageGrid}>
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className={styles.imagePreview}>
                        <Image
                          src={imageUrl}
                          alt={`Uploaded ${index + 1}`}
                          className={styles.previewImage}
                          width={100}
                          height={100}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className={styles.removeImageButton}
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <X className={styles.removeIcon} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className={styles.formCard}>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Add Tags</label>
                <div className={styles.tagInputContainer}>
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter a tag"
                    aria-label="Enter a tag"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddTag}
                    className={styles.addButton}
                    aria-label="Add tag"
                  >
                    <Plus className={styles.addIcon} aria-hidden="true" />
                  </Button>
                </div>
                <div className={styles.tagsContainer} aria-label="Added tags">
                  {productData.tags.map((tag, index) => (
                    <div key={index} className={styles.tag}>
                      <span>{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className={styles.removeTag}
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className={styles.removeIcon} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card className={styles.formCard}>
            <CardHeader>
              <CardTitle>Sizes</CardTitle>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Add Sizes</label>
                <div className={styles.tagInputContainer}>
                  <Input
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Enter a size"
                    aria-label="Enter a size"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddSize}
                    className={styles.addButton}
                    aria-label="Add size"
                  >
                    <Plus className={styles.addIcon} aria-hidden="true" />
                  </Button>
                </div>
                <div className={styles.tagsContainer} aria-label="Added sizes">
                  {productData.sizes.map((size, index) => (
                    <div key={index} className={styles.tag}>
                      <span>{size}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSize(size)}
                        className={styles.removeTag}
                        aria-label={`Remove size ${size}`}
                      >
                        <X className={styles.removeIcon} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card className={styles.formCard}>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Add Colors</label>
                <div className={styles.tagInputContainer}>
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Enter a color"
                    aria-label="Enter a color"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddColor}
                    className={styles.addButton}
                    aria-label="Add color"
                  >
                    <Plus className={styles.addIcon} aria-hidden="true" />
                  </Button>
                </div>
                <div className={styles.tagsContainer} aria-label="Added colors">
                  {productData.colors.map((color, index) => (
                    <div key={index} className={styles.tag}>
                      <span>{color}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveColor(color)}
                        className={styles.removeTag}
                        aria-label={`Remove color ${color}`}
                      >
                        <X className={styles.removeIcon} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className={styles.actionCard}>
          <CardFooter className={styles.cardFooter}>
            <Link href="/admin/products">
              <Button type="button" variant="outline" className={styles.cancelButton}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="default"
              className={styles.saveProductButton}
              disabled={saving}
            >
              {saving ? (
                <>
                  <RefreshCw className={`${styles.saveIcon} ${styles.spinning}`} aria-hidden="true" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className={styles.saveIcon} aria-hidden="true" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}