export interface UserSubscription {
  status: 'active' | 'canceled' | 'trialing' | 'past_due' | null;
  subscriptionId: string | null;
  planId: string | null;
  planName: string | null;
  planType: number | null;
}

export interface UserType {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  termsAccepted: boolean;
  termsAcceptedAt: string | null;
  subscriptionCompleted: boolean;
  profileCompleted: boolean;
  createdAt: string;
  isActive: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  stripeCustomerId: string | null;
  role?: string;
  subscription: UserSubscription;
  __v?: number;
}