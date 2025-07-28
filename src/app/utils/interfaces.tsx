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
  subscriptionCompleted: boolean;
  profileCompleted: boolean;
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
  ratings: [];
  averageRating: number;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  total: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  limit: number;
  page: number;
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

export interface Gig extends Omit<GigDocument, "createdBy"> {
  _id: string;
  createdBy: {
    _id: string;
    fullName: string;
    profilePicture: string;
  };
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

export interface GigData {
  _id: string;
  title: string;
  description: string;
  tier: string;
  price: number;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  keywords: string[];
  releventSkills: string[];
  certification?: {
    name: string;
    url: string;
  };
  providerName:string
}
