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
  location?: string;
  rate?: string;
  reviews?: number;
}

export interface Pagination {
  total: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  limit: number;
  page: number;
}

export interface FileMeta {
  name: string;
  url: string;
  type?: string;
  size?: number;
}

export type Certification = File | FileMeta;

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
    skills?: string[];
    userId?: string;
    certifications?: { fileName: string; url: string; name: string }[];
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
  bidAmountType?: "hourly" | "fixed";
  createdAt: Date;
  updatedAt: Date;
  status: string;
}

export interface GigData {
  _id: string;
  assignedToBid: {
    _id: string;
    bidAmount: number;
    description: string;
    createdBy : string;
  } | null;
  title: string;
  description: string;
  tier: string;
  price: number;
  status: string;
  createdBy: string;
  createdAt: string;
  createdByRole: string;
  updatedAt: string;
  keywords: string[];
  releventSkills: string[];
  certification?: {
    name: string;
    url: string;
  };
  userName: string;
  userId: string;
  statusHistory: [];
}

export interface Column {
  id: number;
  label: string;
  key: string;
  type?: "boolean" | "link" | string;
  href?: string;
  class?: string;
}

export interface PaymentLog {
  gigId: string;
  payments: {
    amount: number;
    date: string;
    status: string;
    stripeIntentId?: string;
    createdBy: string;
    providerId: string;
  }[];
  totalPaid: number;
  gigTitle: string;
  gigDescription: string;
  gigStatus: string;
  gigPrice: number;
  createdAt: string;
  createdBy: {
    fullName?: string;
    profilePicture?: string;
  };
}

export interface DashboardResponse {
  // success: boolean;
  // message: string;
// {
    stats: {
      postedServices: number;
      completedServices: number;
      inQueueServices: number;
      reviews: number;
    };
    gigStatusData: GigStatus[];
    recentProjects: RecentProject[];
    notifications: Notification[];
  // };
}

export interface GigStatus {
  name: string;
  value: number;
}

export interface RecentProject {
  title: string;
  status: string;
  createdAt: string; // ISO date string
}

export interface Notification {
  _id?: string ;
  userId?: string ;
  title: string;
  message: string;
  isRead?: boolean;
  createdAt: string;
  updatedAt: string ;
}
