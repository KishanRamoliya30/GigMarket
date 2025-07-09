import mongoose, { Schema, Document, Types } from 'mongoose';
import { ServiceTier } from '../../../utils/constants';

export interface Certification {
  name: string;
  url: string;
}

export interface GigDocument extends Document {
  title: string;
  description: string;
  tier: ServiceTier;
  price: number;
  rating: number;
  reviews: number;
  keywords: string[];
  releventSkills: string[];
  certification: Certification;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<Certification>(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
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
    releventSkills: [{ type: String, trim: true }],
    certification: { type: CertificationSchema },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  },
  {
    timestamps: true,
  }
);

const Gigs = mongoose.models.gigs || mongoose.model<GigDocument>('gigs', GigSchema);
export default Gigs;
