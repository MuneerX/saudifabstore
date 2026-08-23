import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
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
      default: 0,
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
    strict: false,
  }
);

if (mongoose.models && mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product = mongoose.model('Product', ProductSchema);

export default Product;