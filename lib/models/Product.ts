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
  hasMultipleOptions?: boolean;
  swatchSingleName?: string;
  swatchBulkName?: string;
  swatchBulkPrice?: number;
  enableSubscription?: boolean;
  subscriptionDiscountPercent?: number;
  promoBadge?: string;
  orderCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    _id: {
      type: Schema.Types.Mixed,
      default: () => `prod_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    },
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
      default: 'Saudi Fab Store',
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
    orderCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    swatchSingleName: {
      type: String,
      default: 'Single Standard',
    },
    swatchBulkName: {
      type: String,
      default: '5-Pack Contractors',
    },
    swatchBulkPrice: {
      type: Number,
      min: 0,
    },
    enableSubscription: {
      type: Boolean,
      default: true,
    },
    subscriptionDiscountPercent: {
      type: Number,
      default: 10,
    },
    promoBadge: {
      type: String,
      default: 'FACTORY DIRECT',
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
    hasMultipleOptions: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

ProductSchema.pre('validate', function(next) {
  if (!this._id) {
    this._id = `prod_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }
  next();
});

const Product = (mongoose.models && mongoose.models.Product)
  ? (mongoose.models.Product as mongoose.Model<IProduct>)
  : mongoose.model<IProduct>('Product', ProductSchema);

export default Product;