import mongoose, { Schema, Document } from 'mongoose';

export interface GigDocument extends Document {
  title: string;
  description: string;
  tier: 'Basic' | 'Standard' | 'Premium';
  price: number;
  rating: number;
  reviews: number;
  keywords: string[];
  provider: {
    name: string;
    avatar: string;
    skills: string[];
    certifications: string[];
    userId: mongoose.Types.ObjectId;
  };
  createdAt: Date;
  updatedAt: Date;
}

const GigSchema = new Schema<GigDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tier: { type: String, enum: ['Basic', 'Standard', 'Premium'], default: 'Basic' },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    keywords: [{ type: String }],
    provider: {
      name: { type: String, required: true },
      avatar: { type: String },
      skills: [{ type: String }],
      certifications: [{ type: String }],
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
  },
  { timestamps: true }
);

const Gigs = mongoose.models.Gig || mongoose.model<GigDocument>('gigs', GigSchema);

export default Gigs;
