import { GigDocument } from "../models/gig";
export interface Plan {
  _id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  ispopular: boolean;
  priceId?: string;
  productId?: string;
  type: number;
}

export interface LoginUser {
  _id: string;
  email: string;
  isAdmin: boolean;
  role: string;
  subscriptionCompleted: boolean,
  profileCompleted: boolean
}

export interface ProfileResponse {
  success: boolean;
  profile: Profile;
}
export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface Profile {
  _id: string;
  userId: string;
  fullName: string;
  profilePicture: string;
  professionalSummary: string;
  interests: string[];
  extracurricularActivities: string;
  certifications: Certification[];
  skills: string[];
  currentSchool: string;
  degreeType: string;
  major: string;
  minor?: string;
  graduationYear: string;
  pastEducation: PastEducation[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Certification {
  fileName: string;
  file: { fileName: string };
}

export interface PastEducation {
  school: string;
  degree: string;
  year: string;
  _id: string;
}

export interface Gig extends Omit<GigDocument,'createdBy'> {
  createdBy: {
    _id: string;
    fullName: string;
    profilePicture: string;
  }
  bid: Bid | null;
  bids: number;
}

export interface Bid {
  _id: string;
  bidAmount: number;
  description: string;
  gigId: string;
  createdBy: {
    _id: string;
    fullName: string;
    profilePicture: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
