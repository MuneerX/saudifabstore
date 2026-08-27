import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: string; // Reference to Product ID
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  name?: string;
  email?: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  user: string; // Reference to User ID
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: {
    id?: string;
    status?: string;
    update_time?: string;
    email_address?: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  shippingStatus: 'pending' | 'shipped' | 'delivered';
  shippedAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema(
  {
    product: {
      type: Schema.Types.Mixed,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      default: 'Standard Spec',
    },
    color: {
      type: String,
      default: 'SASO Industrial Finish',
    },
  },
  { strict: false }
);

const ShippingAddressSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const OrderSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.Mixed,
      required: true,
    },
    orderItems: [OrderItemSchema],
    shippingAddress: ShippingAddressSchema,
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    shippingStatus: {
      type: String,
      enum: ['pending', 'shipped', 'delivered'],
      default: 'pending',
      required: true,
    },
    shippedAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Order = (mongoose.models && mongoose.models.Order)
  ? (mongoose.models.Order as mongoose.Model<IOrder>)
  : mongoose.model<IOrder>('Order', OrderSchema);

export default Order;