"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Skeleton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import socket from "../../../utils/socket";
import { apiRequest } from "@/app/lib/apiCall";
import { useUser } from "@/context/UserContext";
import { ChatModalProps } from "@/app/(protected)/chatModal/page";
import CustomTextField from "../customUi/CustomTextField";
import Image from "next/image";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

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
  mediaUrl?: string;
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
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { user } = useUser();
  const currentUserId = user?._id ?? "";

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchChat = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(
        `gig-chat?gigId=${gigId}&user1=${user1Id}&user2=${currentUserId}`,
        { method: "GET" }
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
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiRequest("upload", {
      method: "POST",
      data: formData,
      // isFormData: true,
    });

    if (res.success) {
      return res.data.url; // Assuming backend returns { url: "uploadedFileURL" }
    }
    return null;
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    try {
      let mediaUrl: string | undefined;

      if (selectedFile) {
        mediaUrl = await uploadFile(selectedFile);
      }

      const res = await apiRequest("message", {
        method: "POST",
        data: JSON.stringify({
          chatId,
          sender: currentUserId,
          message: newMessage,
          mediaUrl,
        }),
      });

      if (res.success) {
        const messageData = res.data.data;
        socket.emit("message", {
          chatId: messageData.chatId,
          message: messageData,
        });
        setNewMessage("");
        setShowEmojiPicker(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open) {
      fetchChat();
      setTimeout(scrollToBottom, 300);
    }
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
    <Dialog open={open} fullWidth maxWidth="lg">
      <DialogTitle className="flex justify-between items-center">
        Chat
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        className="h-96 overflow-y-auto space-y-3"
        ref={messagesEndRef}
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => {
            const isCurrentUser = index % 2 === 1;
            return (
              <div
                key={index}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                {!isCurrentUser && (
                  <Skeleton
                    variant="circular"
                    width={32}
                    height={32}
                    className="self-end mr-2"
                  />
                )}
                <div>
                  {!isCurrentUser && (
                    <Skeleton
                      variant="text"
                      width={100}
                      height={18}
                      className="mb-1"
                    />
                  )}
                  <Skeleton
                    variant="rectangular"
                    width={200}
                    height={60}
                    className="rounded-md"
                  />
                </div>
                {isCurrentUser && (
                  <Skeleton
                    variant="circular"
                    width={32}
                    height={32}
                    className="self-end ml-2"
                  />
                )}
              </div>
            );
          })
        ) : messages.length === 0 ? (
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
                  <Image
                    src={
                      msg.sender.profile?.profilePicture ||
                      "/default-avatar.png"
                    }
                    alt={msg.sender.profile?.fullName || "Sender"}
                    width={32}
                    height={32}
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
                    {msg.mediaUrl ? (
                      msg.mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <Image
                          src={msg.mediaUrl}
                          alt="Sent media"
                          width={200}
                          height={200}
                          className="rounded-md"
                        />
                      ) : msg.mediaUrl.match(/\.(mp4|webm)$/i) ? (
                        <video
                          src={msg.mediaUrl}
                          controls
                          className="rounded-md w-full max-w-xs"
                        />
                      ) : (
                        <a
                          href={msg.mediaUrl}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          Download File
                        </a>
                      )
                    ) : (
                      <p>{msg.message}</p>
                    )}
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1 justify-end">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {isCurrentUser &&
                        (msg.seenBy?.length > 1 ? (
                          <span className="text-blue-500">✓✓</span>
                        ) : (
                          <span className="text-gray-400">✓</span>
                        ))}
                    </div>
                  </div>
                </div>
                {isCurrentUser && (
                  <Image
                    src={user?.profile?.profilePicture || "/default-avatar.png"}
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full ml-2 self-end"
                  />
                )}
              </div>
            );
          })
        )}
      </DialogContent>

      {previewUrl && (
        <div className="px-4 pb-2">
          <div className="relative inline-block group">
            {selectedFile?.type.startsWith("image/") ? (
              <Image
                src={previewUrl}
                alt="Preview"
                width={120}
                height={120}
                className="rounded-lg border border-gray-200 shadow-sm object-cover"
              />
            ) : selectedFile?.type.startsWith("video/") ? (
              <video
                src={previewUrl}
                controls
                className="rounded-lg border border-gray-200 shadow-sm w-32 h-auto"
              />
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 shadow-sm px-3 py-2 bg-gray-50">
                📄
                <span className="text-sm text-gray-700 truncate max-w-[150px]">
                  {selectedFile?.name || "File ready to send"}
                </span>
              </div>
            )}

            <button
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md transition-all"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="p-4 flex items-center gap-2">
        <Tooltip title="Emoji">
          <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
            <InsertEmoticonIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Attach File">
          <IconButton onClick={() => fileInputRef.current?.click()}>
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <Box style={{ width: "100%", marginBottom: "-16px" }}>
          <CustomTextField
            multiline
            maxRows={5}
            minRows={1}
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

      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </Dialog>
  );
};

export default ChatModalComponent;
