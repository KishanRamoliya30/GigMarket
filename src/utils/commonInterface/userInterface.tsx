export interface UserSubscription {
  status: 'active' | 'canceled' | 'trialing' | 'past_due' | null;
  subscriptionId: string | null;
  planId: string | null;
  planName: string | null;
  planType: number | null;
  cancelAtPeriodEnd: boolean;
}

export interface UserProfile {
  _id: string;
  userId: string;
  fullName: string;
  profilePicture: string;
  professionalSummary: string;
  interests: string[];
  extracurricularActivities: string;
  certifications: string[];
  skills: string[];
  currentSchool: string;
  degreeType: string;
  major: string;
  minor: string;
  graduationYear: string;
  pastEducation: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface UserType {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  termsAccepted?: boolean;
  termsAcceptedAt?: string | null;
  subscriptionCompleted?: boolean;
  profileCompleted?: boolean;
  isAdmin: boolean;
  isActive: boolean;
  isVerified?: boolean;
  createdAt?: string;
  stripeCustomerId: string | null;
  role?: string;
  subscription?: UserSubscription;
  profile?: UserProfile;
  __v?: number;
}
