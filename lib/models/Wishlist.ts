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

const Wishlist = (mongoose.models && mongoose.models.Wishlist)
  ? (mongoose.models.Wishlist as mongoose.Model<IWishlist>)
  : mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;