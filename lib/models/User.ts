import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  company?: string;
  referralSource?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      sparse: true,
    },
    phone: {
      type: String,
      required: false,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: '',
    },
    referralSource: {
      type: String,
      default: 'Direct',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);