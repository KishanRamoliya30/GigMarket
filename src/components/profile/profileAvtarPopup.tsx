"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  Stack,
  DialogContent,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiRequest } from "@/app/lib/apiCall";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";

interface ProfileImageEditorProps {
  avtar?: string;
  userId: string;
}

const ProfileImageEditor: React.FC<ProfileImageEditorProps> = ({
  avtar,
  userId,
}) => {
  const defaultAvatar = "/default-avatar.png";
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(
    avtar || defaultAvatar
  );

  useEffect(() => {
    if (avtar) setImagePreview(avtar);
  }, [avtar]);

  const fetchProfile = async () => {
    try {
      const res = await apiRequest(`profile?userId=${userId}`, {
        method: "GET",
      });

      if (res.data.success) {
        const latestProfile = res.data.profile;
        setImagePreview(latestProfile.profilePicture || defaultAvatar);
      }
    } catch (err) {
      console.error("Failed to fetch updated profile", err);
    }
  };

  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, JPEG, SVG, and PNG images are allowed.");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
      setNewImageFile(file);
    }
  };

  const handleUpdate = async () => {
    if (!newImageFile) return setOpen(false);

    const formData = new FormData();
    formData.append("profilePicture", newImageFile);

    try {
      const res = await apiRequest(`profile/picture/${userId}`, {
        method: "PUT",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        await fetchProfile();
      } else {
        console.error("Update failed:", res.error);
      }
    } catch (err) {
      console.error("API Error:", err);
    }

    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const res = await apiRequest(`profile/picture/${userId}`, {
        method: "DELETE",
      });

      if (res.data.success) {
        await fetchProfile();
      } else {
        console.error("Delete failed:", res.error);
      }
    } catch (err) {
      console.error("API Error:", err);
    }

    setOpen(false);
  };

  return (
    <Box>
      {/* Avatar Trigger */}
      <Box position="relative" width={100} height={100}>
        <Avatar
          src={imagePreview}
          sx={{ width: 100, height: 100, cursor: "pointer" }}
          onClick={() => setOpen(true)}
        />
        <IconButton
          onClick={() => setOpen(true)}
          size="small"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            bgcolor: "#fff",
            boxShadow: 1,
            ":hover": { bgcolor: "#fff" },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#1d2226", // Dark LinkedIn-style background
            color: "#fff",
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Profile Photo
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 3,
          }}
        >
          {/* Profile Image */}
          <Box
            sx={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              overflow: "hidden",
              mb: 2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Avatar
              src={imagePreview || "/default-avatar.png"}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          {/* Edit/Delete Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              pt: 2,
              mt: 2,
            }}
          >
            <Stack
              alignItems="center"
              spacing={1}
              sx={{ cursor: "pointer" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <PhotoCameraIcon sx={{ color: "#ccc" }} />
              <Typography variant="caption" sx={{ color: "#ccc" }}>
                Add Photo
              </Typography>
            </Stack>

            <Stack
              alignItems="center"
              spacing={1}
              sx={{ cursor: "pointer" }}
              onClick={handleDelete}
            >
              <DeleteIcon sx={{ color: "#ccc" }} />
              <Typography variant="caption" sx={{ color: "#ccc" }}>
                Delete
              </Typography>
            </Stack>
            <Stack
              alignItems="center"
              spacing={1}
              sx={{ cursor: "pointer" }}
              onClick={handleUpdate}
            >
              <PublishedWithChangesIcon sx={{ color: "#ccc" }} />
              <Typography variant="caption" sx={{ color: "#ccc" }}>
                Update Photo
              </Typography>
            </Stack>
          </Box>

          {/* Hidden Input for File Upload */}
          <input
            type="file"
            accept=".png, .jpg, .jpeg, .svg, image/png, image/jpeg, image/svg+xml"
            hidden
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProfileImageEditor;
