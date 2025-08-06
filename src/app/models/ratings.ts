import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  issue: { type: String, required: true },
  improvementSuggestion: { type: String, required: true },
  sincerityAgreement: { type: Boolean, required: true },
  providerResponse: {
    responseText: String,
    challenged: Boolean,
    challengeAccepted: Boolean,
    respondedAt: Date,
  },
});

const ratingSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  review: {
    type: String,
    maxlength: 1000,
  },
  reviewVotes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      upvote: Boolean,
    },
  ],
  complaint: { type: complaintSchema },
  paymentWithheld: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Rejected", "Approved"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Rating =
  mongoose.models.ratings || mongoose.model("ratings", ratingSchema);
export default Rating;
