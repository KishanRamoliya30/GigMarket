import mongoose, { Schema, Document } from "mongoose";

export interface ChatDocument extends Document {
  gigId: mongoose.Types.ObjectId;
  bidId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[]; // [userId, providerId]
  lastMessage?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const ChatSchema = new Schema<ChatDocument>(
  {
    gigId: { type: Schema.Types.ObjectId, ref: "gigs", required: true },
    bidId: { type: Schema.Types.ObjectId, ref: "bids", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Chat = mongoose.models.chat || mongoose.model<ChatDocument>("chat", ChatSchema);
export default Chat; 