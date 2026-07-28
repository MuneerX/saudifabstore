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
  type: Schema.Types.ObjectId,
  ref: 'Product',
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
  required: true,
},
color: {
  type: String,
  required: true,
},
});

const CartSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);