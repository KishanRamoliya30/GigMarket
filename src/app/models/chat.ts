import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ChatDocument extends Document {
  gigId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[]; // [userId, providerId]
  lastMessage?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<ChatDocument>(
  {
    gigId: { type: Schema.Types.ObjectId, ref: "Gig", required: true },
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

const Chat = models.Chat || model<ChatDocument>("Chat", ChatSchema);

export default Chat;
