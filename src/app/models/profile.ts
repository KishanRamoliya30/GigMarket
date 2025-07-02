import mongoose, { Schema, Document } from "mongoose";

interface Certification {
  fileName: string;
}

interface EducationEntry {
  school: string;
  degree: string;
  year: string;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
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
  pastEducation: EducationEntry[];
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
    certifications: [
      {
        fileName: { type: String },
      },
    ],
    skills: [{ type: String }],
    currentSchool: { type: String, required: true },
    degreeType: { type: String, required: true },
    major: { type: String, required: true },
    minor: { type: String },
    graduationYear: { type: String },
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

export default mongoose.models.Profile ||
  mongoose.model<IProfile>("Profile", ProfileSchema);
