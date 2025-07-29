import mongoose, { Schema, Document } from "mongoose";
export interface Certification {
  name: string;
  url: string;
  type?: string;
  size?: number;
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


interface EducationEntry {
  school: string;
  degree: string;
  year: string;
}

interface Ratings {
  userName: string;
  userId: string;
  value: number;
  feedback: string;
  createdAt: Date;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  profilePicture: string;
  professionalSummary: string;
  interests: string[];
  extracurricularActivities: string;
  certifications: Certification;
  skills: string[];
  currentSchool: string;
  degreeType: string;
  major: string;
  minor?: string;
  graduationYear: string;
  pastEducation: EducationEntry[];
  ratings: Ratings[];
  averageRating: number;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true },
    profilePicture: { type: String, required: true },
    professionalSummary: { type: String, required: true },
    interests: [{ type: String }],
    extracurricularActivities: { type: String, required: true },
    certifications: [CertificationSchema],
    skills: [{ type: String }],
    currentSchool: { type: String, required: true },
    degreeType: { type: String, required: true },
    major: { type: String, required: true },
    minor: { type: String },
    graduationYear: { type: String },
    ratings: [
      {
        userName: { type: String, required: true },
        userId: { type: String, required: true },
        value: { type: Number, required: true },
        feedback: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
    pastEducation: [
      {
        school: String,
        degree: String,
        year: String,
      },
    ],
  },
  { timestamps: true }
);

const Profile =
  mongoose.models.profiles || mongoose.model("profiles", ProfileSchema);
export default Profile;
