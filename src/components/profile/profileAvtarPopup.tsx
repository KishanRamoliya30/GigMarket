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
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiRequest } from "@/app/lib/apiCall"; 

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
  const [newImageData, setNewImageData] = useState<string | null>(null);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setNewImageData(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!newImageData) return setOpen(false);

    try {
      const res = await apiRequest(`profile/picture/${userId}`, {
        method: "PUT",
        data: {
          profilePicture: newImageData,
        },
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Profile photo
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          <Avatar
            src={imagePreview}
            sx={{ width: 160, height: 160, mx: "auto", mb: 2 }}
          />

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              Edit
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Stack>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleUpdate}
          >
            Update
          </Button>

          <input
            type="file"
            accept="image/*"
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
