"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import socket from "../../../utils/socket";
import { apiRequest } from "@/app/lib/apiCall";
import { useUser } from "@/context/UserContext";
import { ChatModalProps } from "@/app/(protected)/chatModal/page";
import CustomTextField from "../customUi/CustomTextField";

interface UserProfile {
  _id: string;
  email: string;
  profile: {
    fullName: string;
    profilePicture: string;
  };
}

export interface Message {
  _id: string;
  sender: UserProfile; 
  chatId: string;
  message: string;
  seenBy: string[];
  createdAt: string;
}

const ChatModalComponent: React.FC<ChatModalProps> = ({
  open,
  onClose,
  gigId,
  user1Id,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");

  const { user } = useUser();
  const currentUserId = user?._id ?? "";

  const fetchChat = async () => {
    try {
      const res = await apiRequest(
        `gig-chat?gigId=${gigId}&user1=${user1Id}&user2=${currentUserId}`,
        {
          method: "GET",
        }
      );

      if (res.success) {
        const chat = res.data.data.chat;
        setChatId(chat._id);
        setMessages(res.data.data.messages);

        socket.emit("join", chat._id);
        socket.emit("mark-seen", { chatId: chat._id, userId: user1Id });
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await apiRequest("message", {
        method: "POST",
        data: JSON.stringify({
          chatId,
          sender: currentUserId,
          message: newMessage,
        }),
      });

      if (res.success) {
        const messageData = res.data.data;
        socket.emit("message", {
          chatId: messageData.chatId,
          message: messageData,
        });
        // socket.emit("message", res.data.data.message);
        // setMessages((prev) => [...prev, res.data.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (open) fetchChat();

    return () => {
      if (chatId) socket.emit("leave", chatId);
    };
  }, [open]);

  useEffect(() => {
    socket.on("newMessage", (message: Message) => {
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
        socket.emit("mark-seen", { chatId: message.chatId, userId: user1Id });
      }
    });

    socket.on(
      "seen-update",
      ({ messageId, userId }: { messageId: string; userId: string }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId && !msg.seenBy.includes(userId)
              ? { ...msg, seenBy: [...msg.seenBy, userId] }
              : msg
          )
        );
      }
    );

    return () => {
      socket.off("newMessage");
      socket.off("seen-update");
    };
  }, [chatId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle className="flex justify-between items-center">
        Chat
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="h-96 overflow-y-auto space-y-3">
  {messages.length === 0 ? (
    <p className="text-gray-500 text-center mt-10">No messages yet</p>
  ) : (
    messages.map((msg) => {
      const isCurrentUser = msg.sender._id === currentUserId;

      return (
        <div
          key={msg._id}
          className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
        >
          {!isCurrentUser && (
            <img
              src={
                msg.sender.profile?.profilePicture || "/default-avatar.png"
              }
              alt={msg.sender.profile?.fullName || "Sender"}
              className="w-8 h-8 rounded-full mr-2 self-end"
            />
          )}
          <div>
            {!isCurrentUser && (
              <div className="text-sm text-gray-600 font-medium mb-1">
                {msg.sender.profile?.fullName}
              </div>
            )}
            <div
              className={`p-2 rounded-md max-w-xs break-words ${
                isCurrentUser
                  ? "bg-blue-100 text-right ml-auto"
                  : "bg-gray-200 text-left"
              }`}
            >
              <p>{msg.message}</p>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1 justify-end">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {isCurrentUser &&
                  msg.seenBy?.length > 1 && ( // seen by someone else too
                    <span className="text-blue-500">✓✓</span>
                  )}
              </div>
            </div>
          </div>
          {isCurrentUser && (
            <img
              src={user?.profile?.profilePicture || "/default-avatar.png"}
              alt="You"
              className="w-8 h-8 rounded-full ml-2 self-end"
            />
          )}
        </div>
      );
    })
  )}
</DialogContent>


      <div className="p-4 flex items-center gap-2">
        <Box style={{ width: "100%", marginBottom: "-16px" }}>
          <CustomTextField
            fullWidth
            name="message"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </Box>
        <IconButton color="primary" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </div>
    </Dialog>
  );
};

export default ChatModalComponent;
