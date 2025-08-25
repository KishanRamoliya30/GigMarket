import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    benefits: [{ type: String }],
    ispopular: { type: Boolean, default: false },
    priceId : {type: String, required: false},
    productId : {type: String, required: false},
    type: { type: Number, enum: [1, 2, 3], required: true }
  },
  { 
    timestamps: true,
    collection: "plans"
  }
);

const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema);

export default Plan;