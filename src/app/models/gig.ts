import mongoose, { Schema, Document, Types } from 'mongoose';
import { ServiceTier } from '../../../utils/constants';

export interface Certification {
  name: string;
  url: string;
  type?: string;
  size?: number;
}
type GigStatus = "Open" | "Requested" | "Assigned" | "Not-Assigned" | "In-Progress" | "Completed" | "Approved" |"Rejected";

export interface GigDocument extends Document {
  title: string;
  description: string;
  tier: ServiceTier;
  price: number;
  time: number;
  rating: number;
  reviews: number;
  keywords: string[];
  releventSkills: string[];
  certification: Certification;
  gigImage: Certification;
  createdByRole: 'User' | 'Provider';
  status: GigStatus;
  isPublic: boolean;
  createdBy: Types.ObjectId;
  assignedToBid: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<Certification>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String },
    size: { type: Number },
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
    time: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    keywords: [{ type: String, trim: true }],
    releventSkills: [{ type: String, trim: true }],
    certification: { type: CertificationSchema, required: true },
    gigImage: { type: CertificationSchema, required: true },
    createdByRole: {
      type: String,
      enum: ['User', 'Provider'],
      required: true,
    },
    isPublic: { type: Boolean, required: true, default: false },
    status: {
      type: String,
      enum: ["Open", "Requested", "Assigned", "Not-Assigned", "In-Progress", "Completed", "Approved", "Rejected"],
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedToBid: { type: Schema.Types.ObjectId, ref: 'bids', default: null },
  },
  {
    timestamps: true,
  }
);

const Gigs = mongoose.models.gigs || mongoose.model<GigDocument>('gigs', GigSchema);
export default Gigs;
