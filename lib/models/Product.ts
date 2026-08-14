import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  sku?: string;
  discountPrice?: number;
  specImage?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  fabricationDetails?: string;
  surfacePreparation?: string;
  testingCertifications?: string;
  tags?: string[];
  sizes?: string[];
  colors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: 'Brooq Al Khalij',
    },
    images: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sku: {
      type: String,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    specImage: {
      type: String,
      default: '',
    },
    material: {
      type: String,
      default: '',
    },
    dimensions: {
      type: String,
      default: '',
    },
    weight: {
      type: String,
      default: '',
    },
    fabricationDetails: {
      type: String,
      default: '',
    },
    surfacePreparation: {
      type: String,
      default: '',
    },
    testingCertifications: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
      },
    ],
    sizes: [
      {
        type: String,
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

if (mongoose.models && mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.model<IProduct>('Product', ProductSchema);