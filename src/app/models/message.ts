import mongoose, { Schema, Document, model, models } from "mongoose";

export interface MediaFile {
  url: string;
  name: string;
  type: string;
  size?: number;
}

export interface PaymentRequest {
  amount: number;
  description?: string;
  amountType: string;
  status: "Pending" | "Approved" | "Rejected";
  gigId: mongoose.Types.ObjectId;
}

export interface MessageDocument extends Document {
  chatId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message?: string;
  mediaFiles?: MediaFile[];
  paymentRequest?: PaymentRequest;
  seenBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MediaFileSchema = new Schema<MediaFile>({
  url: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number },
});

const paymentRequestSchema = new Schema<PaymentRequest>(
  {
    amount: { type: Number, required: true },
    description: { type: String },
    amountType: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Pending", "Approved", "Rejected"], 
      default: "Pending" 
    },
    gigId: { type: Schema.Types.ObjectId, ref: "gigs", required: true },
  },
  { _id: false }
);

const MessageSchema = new Schema<MessageDocument>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "chats", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "users", required: true },
    message: { type: String, default: "" },
    mediaFiles: [MediaFileSchema],
    paymentRequest: { type: paymentRequestSchema },
    seenBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true }
);

const Message =
  models.messages || model<MessageDocument>("messages", MessageSchema);

export default Message;
