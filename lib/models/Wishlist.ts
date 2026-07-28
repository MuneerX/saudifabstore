import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
  user: string; // Reference to User ID
  products: string[]; // Array of Product IDs
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);