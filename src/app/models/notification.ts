import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  receiverId: string;
  senderId: string;
  link?: string;
  title: string;
  message: string;
  isRead: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    receiverId: { type: String, required: true },
    senderId: { type: String, required: true },
    link: { type: String },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default NotificationModel;
