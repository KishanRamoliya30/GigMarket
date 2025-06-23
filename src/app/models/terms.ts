import mongoose, { Schema, models } from "mongoose";

const TermsSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "terms",
  }
);

const Terms = models.Terms || mongoose.model("Terms", TermsSchema);
export default Terms;
