import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    benefits: [{ type: String }],
    ispopular: { type: Boolean, default: false },
  },
  { 
    timestamps: true,
    collection: "plans"
  }
);

export default mongoose.models.Plan || mongoose.model("Plan", planSchema);
