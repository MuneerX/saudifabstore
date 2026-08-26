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
      type: Schema.Types.Mixed,
      required: true,
    },
    products: [
      {
        type: Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Clear model cache
if (mongoose.models.Wishlist) {
  delete mongoose.models.Wishlist;
}

export default mongoose.model<IWishlist>('Wishlist', WishlistSchema);