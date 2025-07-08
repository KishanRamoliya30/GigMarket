import mongoose, { Schema, Document, Types } from 'mongoose';
import { ServiceTier } from '../../../utils/constants';

export interface ProviderInfo {
  name: string;
  avatar?: string;
  skills: string[];
  certifications: string[];
  userId: Types.ObjectId;
}

export interface GigDocument extends Document {
  title: string;
  description: string;
  tier: ServiceTier;
  price: number;
  rating: number;
  reviews: number;
  keywords: string[];
  provider: ProviderInfo;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderSchema = new Schema<ProviderInfo>(
  {
    name: { type: String, required: true },
    avatar: { type: String },
    skills: [{ type: String }],
    certifications: [{ type: String }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  },
  { _id: false }
);

const GigSchema = new Schema<GigDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    tier: {
      type: String,
      enum: Object.values(ServiceTier),
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    keywords: [{ type: String, trim: true }],
    provider: { type: ProviderSchema, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  },
  {
    timestamps: true,
  }
);

const Gigs = mongoose.models.gigs || mongoose.model<GigDocument>('gigs', GigSchema);
export default Gigs;
