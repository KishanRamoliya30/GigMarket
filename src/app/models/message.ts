import mongoose, { Schema, Document } from "mongoose";

export interface MessageDocument extends Document {
    chatId: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
}

// const MessageSchema = new Schema<MessageDocument>(
//   {
//     chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
//     sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     text: { type: String, required: true },
//   },
//   { timestamps: true }
// );

const MessageSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
    //   createdAt: { type: Date, default: Date.now },
},
    { timestamps: true }
);

const Message = mongoose.models.message || mongoose.model<MessageDocument>("message", MessageSchema);
export default Message;
