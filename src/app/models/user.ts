import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  termsAccepted: {
    type: Boolean,
    required: [true, "You must accept the Terms of Service"],
  },
  subscriptionCompleted: {
    type: Boolean,
    default: false,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
