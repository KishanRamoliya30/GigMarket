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

interface ProfileImageEditorProps {
  avtar?: string;
}

const ProfileImageEditor: React.FC<ProfileImageEditorProps> = ({ avtar }) => {
  const defaultAvatar = "/default-avatar.png";
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(
    avtar || defaultAvatar
  );

  // Update preview if avtar prop changes
  useEffect(() => {
    if (avtar) {
      setImagePreview(avtar);
    }
  }, [avtar]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setImagePreview(defaultAvatar);
    setOpen(false);
  };

  return (
    <Box>
      {/* Trigger Avatar */}
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
            bgcolor: "#ffff",
            boxShadow: 1,
            ":hover": { bgcolor: "#ffff" },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Popup Dialog */}
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
            onClick={() => {
              console.log("Updated image:", imagePreview);
              setOpen(false);
            }}
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
