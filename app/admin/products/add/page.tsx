"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle
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

export default function AddProductPage() {
  const router = useRouter();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [newTag, setNewTag] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);

  // Initialize character count on mount
  useEffect(() => {
    setDescriptionCharCount(productData.description.length);
  }, [productData.description.length]);

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

  const handleImageUpload = async (files: File[]) => {
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
    console.log('File input change event triggered');
    console.log('Files object:', files);

    if (!files) {
      console.log('No files object');
      return;
    }

    if (files.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log('Files selected:', files.length);
    for (let i = 0; i < files.length; i++) {
      console.log(`File ${i}:`, files[i].name, files[i].type, files[i].size);
    }

    handleImageUpload(Array.from(files));

    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleUploadAreaClick = () => {
    console.log('Upload area clicked, uploadingImages:', uploadingImages);
    if (!uploadingImages) {
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) {
        console.log('Triggering file input click');
        fileInput.click();
      } else {
        console.error('File input not found');
      }
    } else {
      console.log('Upload in progress, ignoring click');
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
    // Only set drag over to false if we're actually leaving the upload area
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (uploadingImages) {
      console.log('Upload in progress, ignoring drop');
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files.length, files);

    if (files.length === 0) {
      setError('No files detected in drop');
      return;
    }

    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      setError('Please drop only image files (JPEG, PNG, WebP)');
      return;
    }

    if (imageFiles.length !== files.length) {
      console.log(`Filtered ${files.length} files to ${imageFiles.length} image files`);
    }

    console.log('Processing dropped image files:', imageFiles.length);
    handleImageUpload(imageFiles);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!productData.name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!productData.category) {
      setError("Category is required");
      return false;
    }
    if (!productData.price || parseFloat(productData.price) <= 0) {
      setError("Valid price is required");
      return false;
    }
    if (!productData.stock || parseInt(productData.stock) < 0) {
      setError("Valid stock quantity is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare product data for API
      const productPayload = {
        name: productData.name.trim(),
        description: productData.description.trim() || undefined,
        category: productData.category,
        price: parseFloat(productData.price) || 0,
        discountPrice: productData.discountPrice ? parseFloat(productData.discountPrice) : undefined,
        stock: parseInt(productData.stock) || 0,
        sku: productData.sku.trim() || undefined,
        images: uploadedImages.length > 0 ? uploadedImages : [],
        tags: productData.tags.length > 0 ? productData.tags : undefined,
        sizes: productData.sizes.length > 0 ? productData.sizes : undefined,
        colors: productData.colors.length > 0 ? productData.colors : undefined,
      };

      console.log('Product payload being sent:', productPayload);

      // Create product via API
      await apiClient.createAdminProduct(productPayload);

      setSuccess(true);

      // Redirect to products list after a short delay
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);

    } catch (err) {
      console.error('Error creating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.addProductPage}>
      <div className={styles.header}>
        <Link href="/admin/products" className={styles.backLink}>
          <ArrowLeft className={styles.backIcon} aria-hidden="true" />
          Back to Products
        </Link>
        <h1 className={styles.title}>Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Error and Success Messages */}
        {error && (
          <div className={styles.messageContainer}>
            <div className={styles.errorMessage}>
              <AlertCircle className={styles.messageIcon} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className={styles.messageContainer}>
            <div className={styles.successMessage}>
              <CheckCircle className={styles.messageIcon} />
              <span>Product created successfully! Redirecting...</span>
            </div>
          </div>
        )}

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
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Select Files button clicked');
                    }}
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
               <Button
                 type="button"
                 variant="outline"
                 className={styles.cancelButton}
                 disabled={isSubmitting}
               >
                 Cancel
               </Button>
             </Link>
             <Button
               type="submit"
               variant="default"
               className={styles.addProductButton}
               disabled={isSubmitting || success}
             >
               {isSubmitting ? (
                 <>
                   <Loader2 className={styles.spinnerIcon} />
                   Creating Product...
                 </>
               ) : success ? (
                 <>
                   <CheckCircle className={styles.checkIcon} />
                   Product Created!
                 </>
               ) : (
                 'Add Product'
               )}
             </Button>
           </CardFooter>
         </Card>
      </form>
    </div>
  );
}