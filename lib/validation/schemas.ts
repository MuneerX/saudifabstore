import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
});

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Product description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
 brand: z.string().min(1, 'Brand is required'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  stock: z.number().min(0, 'Stock must be a positive number'),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  description: z.string().min(1, 'Product description is required').optional(),
  price: z.number().min(0, 'Price must be a positive number').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  brand: z.string().min(1, 'Brand is required').optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required').optional(),
  stock: z.number().min(0, 'Stock must be a positive number').optional(),
});

// Order validation schemas
export const createOrderSchema = z.object({
  shippingAddress: z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

// Cart validation schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export const updateCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export const removeFromCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

// Wishlist validation schemas
export const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

export const removeFromWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});