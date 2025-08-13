import mongoose, { Schema, Document, Types } from 'mongoose';
import { ServiceTier } from '../../../utils/constants';
import { FileMeta } from '../utils/interfaces';

export const statusList = ["Open", "Requested", "Assigned", "Not-Assigned", "In-Progress", "Completed", "Approved", "Rejected"]
const prevStatusList = [...statusList, ""]
export type GigStatus = "Open" | "Requested" | "Assigned" | "Not-Assigned" | "In-Progress" | "Completed" | "Approved" |"Rejected";

export interface StatusHistory {
  previousStatus: GigStatus;
  currentStatus: GigStatus;
  changedBy: Types.ObjectId;
  changedByName: string;
  changedByRole: 'User' | 'Provider' | 'Admin';
  description?: string;
  changedAt: Date;
}
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
  certification: FileMeta;
  gigImage: FileMeta;
  createdByRole: 'User' | 'Provider';
  status: GigStatus;
  isPublic: boolean;
  createdBy: Types.ObjectId;
  assignedToBid: Types.ObjectId | null;
  statusHistory: StatusHistory[];
  createdAt: Date;
  updatedAt: Date;
  paymentStatus: 'Completed' | 'Failed' | null;
}

const StatusHistorySchema = new Schema<StatusHistory>(
  {
    previousStatus: {
      type: String,
      enum: prevStatusList,
    },
    currentStatus: {
      type: String,
      enum: statusList,
      required: true,
    },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    changedByRole: {
      type: String,
      enum: ['User', 'Provider', 'Admin'],
      required: true,
    },
    description: { type: String },
    changedByName: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);


const CertificationSchema = new Schema<FileMeta>(
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
      enum: statusList,
      required: true,
    },
    statusHistory: { type: [StatusHistorySchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedToBid: { type: Schema.Types.ObjectId, ref: 'bids', default: null },
    paymentStatus: {
      type: String,
      enum: ['Completed', 'Failed', null],
      default: null
    }
  },
  {
    timestamps: true,
  }
);

const Gigs = mongoose.models.gigs || mongoose.model<GigDocument>('gigs', GigSchema);
export default Gigs;
