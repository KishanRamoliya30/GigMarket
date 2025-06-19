import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";

type CustomDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "error" | "success" | "warning" | "info";
};

export default function CustomDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  content = "Do you want to proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "error",
}: Readonly<CustomDialogProps>) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { minWidth: 360, px: 1.5, py: 1.5 } }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
      >
        <DialogTitle sx={{ p: 0 }}>{title}</DialogTitle>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{ backgroundColor: "#f4f4f4", borderColor: "#ccc" }}
        >
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
