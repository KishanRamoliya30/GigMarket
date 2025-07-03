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
}

export interface ProfileResponse {
  success: boolean;
  profile: Profile;
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
