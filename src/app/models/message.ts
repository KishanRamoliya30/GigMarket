import mongoose, { Schema, Document, model, models } from "mongoose";

export interface MediaFile {
  url: string;
  name: string;
  type: string;
  size?: number;
}

export interface MessageDocument extends Document {
  chatId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message?: string;
  mediaFiles?: MediaFile[];
  seenBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MediaFileSchema = new Schema<MediaFile>(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false }
);

const MessageSchema = new Schema<MessageDocument>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "chats", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "users", required: true },
    message: { type: String },
    mediaFiles: [MediaFileSchema],
    seenBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true }
);

const Message =
  models.messages || model<MessageDocument>("messages", MessageSchema);

export default Message;
