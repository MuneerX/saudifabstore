import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  product: string; // Reference to Product ID
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export interface ICart extends Document {
  user: string; // Reference to User ID
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema({
  product: {
    type: Schema.Types.Mixed,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  size: {
    type: String,
    default: 'Regular',
  },
  color: {
    type: String,
    default: 'Default Color',
  },
});

const CartSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.Mixed,
      required: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
    strict: false
  }
);

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);