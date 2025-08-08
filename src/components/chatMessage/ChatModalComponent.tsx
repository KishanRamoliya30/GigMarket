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

interface Message {
  _id: string;
  sender: string;
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
        console.log("######65", chat, res)
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
    // if (!newMessage.trim()) return;

        console.log("######66", {
          chatId,
          sender: currentUserId,
          message: newMessage,
        })

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
        socket.emit("message", res.data.data.message);
        setMessages((prev) => [...prev, res.data.message]);
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
        console.log("######67", JSON.stringify({ chatId: message.chatId, userId: user1Id }))
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
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded-md max-w-xs ${
                msg.sender === user1Id
                  ? "bg-blue-100 self-end ml-auto"
                  : "bg-gray-200"
              }`}
            >
              <p>{msg.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleTimeString()}
                {msg.sender === user1Id &&
                  msg.seenBy.includes(currentUserId) &&
                  " ✓✓"}
              </span>
            </div>
          ))
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
