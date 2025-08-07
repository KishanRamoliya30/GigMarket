import mongoose ,{Schema} from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide a first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name"],
  },
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
  termsAcceptedAt: {
    type: Date,
    default: null,
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
  isAdmin: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date, 
  resetPasswordOTP: String,
  resetPasswordOTPExpiry: Date,  
  stripeCustomerId: {
    type: String,
    default: null
  },
  subscription: {
    status: {
      type: String,
      enum: ['active', 'canceled', 'trialing', 'past_due', null],
      default: null
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null
    },
    cancelAtPeriodEnd : {
      type: Boolean,
      default: false
    },
    planId: {
      type: String,
      default: null
    },
    planName: {
      type: String,
      default: null
    },
    planType: {
      type: Number,
      default: null
    },
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  profile: {
    type: Schema.Types.ObjectId,
    ref: "profiles",
  },
  stripeConnectAccountId: {
    type: String,
    default: null
  },
  stripeConnectAccountStatus:{
    type: String,
    default: null
  }
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
