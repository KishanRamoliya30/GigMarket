import mongoose, { Schema, Document, model, models } from "mongoose";

export interface MessageDocument extends Document {
  chatId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message: string;
  seenBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<MessageDocument>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "chats", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "users", required: true },
    message: { type: String, required: true },
    seenBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true }
);

const Message =
  models.messages || model<MessageDocument>("messages", MessageSchema);

export default Message;
